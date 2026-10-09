import { createHash } from 'node:crypto';
import { assertEvidence, validateInput } from '../../validation/cartographer.ts';
import { hashJson, stableJson } from '../../core/serialization.ts';
import type { DeepRead } from '../cartographer/contract.ts';
import { ResearchAnalysisSchema, ResearcherInputSchema, ResearchPacketSchema } from './contract.ts';
import type { ResearchAnalysis, ResearcherInput } from './contract.ts';
import { assertDocumentUrl } from './policies.ts';

function unique(values: string[], label: string) {
	if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}.`);
}
export function articleContext(input: ResearcherInput) {
	return validateInput({ inventory: input.inventory, limits: { maxDeepReads: 2,
		maxBodyCharacters: input.limits.maxBodyCharacters, maxSourceBytes: input.limits.maxSourceBytes } });
}
export function validateResearchInput(raw: unknown): ResearcherInput {
	const input = ResearcherInputSchema.parse(raw);
	articleContext(input);
	const { decision, cartography, inventory, research, limits } = input;
	unique(decision.targets.map(target => target.sourceId), 'approved targets');
	if (inventory.articles.length !== 2 || !cartography.recommended
		|| stableJson(decision.targets) !== stableJson(cartography.targets)
		|| decision.analysisHash !== hashJson(cartography)
		|| cartography.analysisContext.selectedInventoryHash !== hashJson(inventory)) throw new Error('Exactly two approved targets must match the unchanged Cartographer analysis.');
	for (const target of decision.targets) {
		const article = inventory.articles.find(item => item.source_id === target.sourceId);
		if (!article || article.source_path !== target.sourcePath || article.content_hash !== target.contentHash
			|| article.title !== target.title || article.parse_status === 'error') throw new Error('Unknown or changed approved target.');
	}
	if (research.sources.length > limits.maxDocuments) throw new Error('Document budget exceeded.');
	unique(research.sources.map(source => source.id), 'document IDs');
	unique(research.sources.map(source => source.url), 'document URLs');
	for (const source of research.sources) {
		assertDocumentUrl(source.url, limits.allowedDocumentHosts);
		assertDocumentUrl(source.retrieval.finalUrl, limits.allowedDocumentHosts);
		if (source.url !== source.retrieval.finalUrl) throw new Error('Document redirect requires explicit source review.');
		unique(source.excerpts.map(excerpt => excerpt.id), 'excerpt IDs');
		if (source.excerpts.some(excerpt => excerpt.text.length > 2000)) throw new Error('Excerpt budget exceeded.');
	}
	unique(research.questions.map(question => question.id), 'question IDs');
	const mapFindings = new Set(cartography.needsResearch.map(finding => finding.id));
	for (const question of research.questions) for (const id of question.cartographerFindingIds) {
		if (!mapFindings.has(id)) throw new Error('Unknown Cartographer research finding.');
	}
	for (const id of mapFindings) if (!research.questions.some(question => question.cartographerFindingIds.includes(id))) {
		throw new Error('Cartographer research question not covered.');
	}
	unique(research.probes.map(probe => probe.id), 'probe IDs');
	for (const probe of research.probes) {
		if (createHash('sha256').update(probe.code).digest('hex') !== probe.codeHash) throw new Error('Probe code hash mismatch.');
	}
	return input;
}

export function findings(analysis: ResearchAnalysis) {
	return [...analysis.verifiedFacts, ...analysis.outdatedClaims, ...analysis.incorrectClaims,
		...analysis.ambiguousClaims, ...analysis.securityNotes, ...analysis.codeReview];
}
export function sourceRegister(input: ResearcherInput, analysis: ResearchAnalysis) {
	const evidence = [...analysis.environment.evidence, ...findings(analysis).flatMap(finding => finding.evidence)];
	return input.research.sources.filter(source => evidence.some(item => item.documentId === source.id)).map(source => {
		const { excerpts, ...metadata } = source;
		return { ...metadata, evidenceIds: excerpts.filter(excerpt => evidence.some(item =>
			item.documentId === source.id && item.excerptId === excerpt.id)).map(excerpt => excerpt.id) };
	});
}
export function validateResearchAnalysis(raw: unknown, input: ResearcherInput, reads: DeepRead[]): ResearchAnalysis {
	const analysis = ResearchAnalysisSchema.parse(raw);
	if (analysis.environment.asOfDate !== input.research.asOfDate) throw new Error('Research date must match the evidence snapshot.');
	const all = findings(analysis);
	unique(all.map(finding => finding.id), 'finding IDs');
	const questions = new Set(input.research.questions.map(question => question.id));
	const known = new Map(all.map(finding => [finding.id, finding]));
	const documents = new Map(input.research.sources.map(source => [source.id, source]));
	const probes = new Set(input.research.probes.map(probe => probe.id));
	for (const item of [...analysis.environment.evidence, ...all.flatMap(finding => finding.evidence)]) {
		if (!documents.get(item.documentId)?.excerpts.some(excerpt => excerpt.id === item.excerptId)) throw new Error('Unknown document or excerpt evidence.');
	}
	for (const finding of all) {
		if (finding.status === 'verified' && !finding.evidence.length) throw new Error('Verified factual finding requires documentation evidence.');
		if (finding.questionIds.some(id => !questions.has(id))) throw new Error('Unknown research question.');
		assertEvidence(finding.articleEvidence, articleContext(input), reads);
	}
	for (const finding of [...analysis.outdatedClaims, ...analysis.incorrectClaims, ...analysis.ambiguousClaims, ...analysis.securityNotes]) {
		if (!finding.articleEvidence.length) throw new Error('Article critique requires article evidence.');
	}
	for (const finding of analysis.codeReview) {
		unique(finding.probeIds, 'code probe references');
		if (finding.probeIds.some(id => !probes.has(id))) throw new Error('Unknown code probe.');
		if (finding.verification === 'executed-probe' && !finding.probeIds.length) throw new Error('Executed code requires an actual probe.');
		if (finding.verification === 'needs-review' && finding.status !== 'needs-review') throw new Error('Unverified code cannot be a verified finding.');
	}
	function checkRefs(ids: string[]) {
		unique(ids, 'finding references');
		if (ids.some(id => !known.has(id))) throw new Error('Unknown finding reference.');
	}
	unique(analysis.recommendations.map(item => item.id), 'recommendation IDs');
	for (const item of [...analysis.recommendations, ...analysis.writerHandoff.keep, ...analysis.writerHandoff.correct,
		...analysis.writerHandoff.avoid, ...analysis.writerHandoff.caution]) checkRefs(item.findingIds);
	for (const id of analysis.writerHandoff.verifiedCodeFindingIds) {
		if (!analysis.codeReview.some(finding => finding.id === id && finding.status === 'verified'
			&& finding.verification !== 'needs-review')) throw new Error('Writer handoff references unverified code.');
	}
	unique(analysis.questionAnswers.map(answer => answer.questionId), 'question answers');
	unique(analysis.unresolvedQuestions.map(answer => answer.questionId), 'unresolved questions');
	if (analysis.questionAnswers.length !== questions.size) throw new Error('All research questions need an answer.');
	for (const answer of analysis.questionAnswers) {
		if (!questions.has(answer.questionId)) throw new Error('Unknown answered question.');
		checkRefs(answer.findingIds);
		if (answer.findingIds.some(id => !known.get(id)!.questionIds.includes(answer.questionId))) throw new Error('Answer references unrelated findings.');
		if (answer.status === 'resolved' && (!answer.findingIds.length
			|| answer.findingIds.some(id => known.get(id)!.status !== 'verified'))) throw new Error('Resolved answer needs verified findings.');
		if ((answer.status === 'needs-review') !== analysis.unresolvedQuestions.some(item => item.questionId === answer.questionId)) {
			throw new Error('Unresolved answer must be explicitly marked needs-review.');
		}
	}
	if (analysis.unresolvedQuestions.some(item => !questions.has(item.questionId))) throw new Error('Unknown unresolved question.');
	return analysis;
}

export function validateResearchPacket(raw: unknown, input: ResearcherInput, reads: DeepRead[], expectedRequestHash?: string) {
	const packet = ResearchPacketSchema.parse(raw);
	const { schemaVersion: _version, targets: _targets, sourceRegister: _sources, analysisContext: _context, ...rawAnalysis } = packet;
	const analysis = validateResearchAnalysis(rawAnalysis, input, reads);
	if (stableJson(packet.targets) !== stableJson(input.decision.targets)) throw new Error('Unknown packet target.');
	if (stableJson(packet.sourceRegister) !== stableJson(sourceRegister(input, analysis))) throw new Error('Source register contains orphan, missing or forged references.');
	const context = packet.analysisContext;
	if (expectedRequestHash !== undefined && context.requestHash !== expectedRequestHash) throw new Error('Packet request hash mismatch.');
	if (context.inputHash !== hashJson(input) || context.decisionHash !== hashJson(input.decision)
		|| context.cartographyHash !== hashJson(input.cartography) || context.researchBundleHash !== hashJson(input.research)
		|| context.topicSlug !== input.research.topicSlug
		|| stableJson(context.probes) !== stableJson(input.research.probes.map(({ code: _code, ...probe }) => probe))) throw new Error('Packet provenance mismatch.');
	return packet;
}
