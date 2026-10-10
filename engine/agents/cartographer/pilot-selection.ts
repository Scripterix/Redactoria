import { z } from 'zod';
import type { LanguageModel, StructuredRequest } from '../../core/language-model.ts';
import { hashJson, stableJson } from '../../core/serialization.ts';
import { assertEvidence, validateInput } from '../../validation/cartographer.ts';
import { DeepReadSchema, EvidenceSchema } from './contract.ts';
import type { CartographerInput, DeepRead } from './contract.ts';
import type { SourceReader } from './agent.ts';

const text = z.string().trim().min(1);
const rating = z.number().int().min(1).max(5);
const screeningEntry = z.strictObject({ sourceId: text, reason: text });
export const PilotScreeningSchema = z.strictObject({
	schemaVersion: z.literal(1),
	shortlist: z.array(screeningEntry).min(10).max(25),
	exclusions: z.array(screeningEntry),
});
export const PilotScoresSchema = z.strictObject({
	educationalValue: rating, outdatedRisk: rating, researchCost: rating,
	codeTestability: rating, securityRisk: rating, scopeClarity: rating,
	internalLinking: rating, beginnerUsefulness: rating,
});
export const PilotAnalysisSchema = z.strictObject({
	assessments: z.array(z.strictObject({
		sourceId: text, disposition: z.enum(['select', 'defer']), proposedTitle: text,
		domain: z.enum(['PHP', 'JavaScript', 'Web/API', 'HTML/CSS', 'Markdown', 'Git', 'Python', 'Tooling']),
		scores: PilotScoresSchema, recommendedScope: text, reason: text,
		researchNeeds: z.array(text).min(1), internalLinkSourceIds: z.array(text),
		evidence: z.array(EvidenceSchema).min(1),
	})).min(10).max(25),
	limitations: z.array(text).min(1),
});
export const PILOT_WEIGHTS = Object.freeze({
	educationalValue: 20, codeTestability: 20, beginnerUsefulness: 15,
	scopeClarity: 15, internalLinking: 10, outdatedRisk: 5, researchCost: 10, securityRisk: 5,
});
type Scores = z.infer<typeof PilotScoresSchema>;
const risks = new Set<keyof Scores>(['outdatedRisk', 'researchCost', 'securityRisk']);

/** Editorial ordinal inputs, deterministic ordering; not measured quality/cost. */
export function pilotScore(raw: Scores): number {
	const scores = PilotScoresSchema.parse(raw);
	return Object.entries(PILOT_WEIGHTS).reduce((sum, [key, weight]) => {
		const criterion = key as keyof Scores;
		return sum + weight * (risks.has(criterion) ? 6 - scores[criterion] : scores[criterion]);
	}, 0) / 5;
}

export async function preparePilotSelection(rawInput: unknown, rawScreening: unknown, prompt: string, reader: SourceReader) {
	const input = validateInput(rawInput);
	const screening = PilotScreeningSchema.parse(rawScreening);
	const ids = [...screening.shortlist, ...screening.exclusions].map((entry) => entry.sourceId);
	const known = new Set(input.inventory.articles.map((article) => article.source_id));
	if (new Set(ids).size !== ids.length || ids.length !== known.size || ids.some((id) => !known.has(id))) {
		throw new Error('Screening must cover every inventory source exactly once.');
	}
	if (screening.shortlist.length > input.limits.maxDeepReads) throw new Error('Pilot deep-read budget exceeded.');
	const reads: DeepRead[] = [];
	for (const entry of screening.shortlist) {
		const source = input.inventory.articles.find((article) => article.source_id === entry.sourceId)!;
		if (source.parse_status === 'error') throw new Error('Cannot shortlist a parse-error source.');
		const read = DeepReadSchema.parse(await reader(source, input.limits));
		if (read.sourceId !== source.source_id || read.sourcePath !== source.source_path || read.contentHash !== source.content_hash) {
			throw new Error('Pilot read identity/hash mismatch.');
		}
		if (read.truncated || read.body.length > input.limits.maxBodyCharacters) throw new Error('Pilot requires full untruncated bodies.');
		reads.push(read);
	}
	const request: StructuredRequest = {
		phase: 'pilot-selection', instructions: prompt,
		context: { input, screening, selectedArticles: reads, weights: PILOT_WEIGHTS, count: 10 },
		jsonSchema: z.toJSONSchema(PilotAnalysisSchema),
	};
	return { input, screening, reads, request };
}
export type PreparedPilot = Awaited<ReturnType<typeof preparePilotSelection>>;

export function validatePilotAnalysis(raw: unknown, input: CartographerInput, reads: DeepRead[]) {
	const analysis = PilotAnalysisSchema.parse(raw);
	const wanted = new Set(reads.map((read) => read.sourceId));
	const actual = analysis.assessments.map((entry) => entry.sourceId);
	if (new Set(actual).size !== actual.length || actual.length !== wanted.size || actual.some((id) => !wanted.has(id))) {
		throw new Error('Assess each supplied source exactly once; no excluded sources.');
	}
	if (analysis.assessments.filter((entry) => entry.disposition === 'select').length !== 10) throw new Error('Select exactly ten pilot candidates.');
	const known = new Set(input.inventory.articles.map((article) => article.source_id));
	for (const entry of analysis.assessments) {
		assertEvidence(entry.evidence, input, reads);
		if (!entry.evidence.some((item) => item.sourceId === entry.sourceId && item.field === 'body')) throw new Error('Each assessment needs its own body evidence.');
		if (entry.evidence.some((item) => item.sourceId !== entry.sourceId)) throw new Error('Assessment evidence must belong to its source.');
		if (new Set(entry.internalLinkSourceIds).size !== entry.internalLinkSourceIds.length
			|| entry.internalLinkSourceIds.some((id) => !known.has(id) || id === entry.sourceId)) throw new Error('Invalid internal-link opportunity.');
	}
	return analysis;
}

export async function runPilotSelection(prepared: PreparedPilot, model: LanguageModel) {
	const analysis = validatePilotAnalysis(await model.generateStructured(prepared.request), prepared.input, prepared.reads);
	const assessed = analysis.assessments.map((entry) => {
		const source = prepared.input.inventory.articles.find((article) => article.source_id === entry.sourceId)!;
		return { ...entry, source: { sourceId: source.source_id, sourcePath: source.source_path,
			title: source.title, originalUrl: source.original_url, contentHash: source.content_hash }, weightedScore: pilotScore(entry.scores) };
	});
	const ranking = assessed.filter((entry) => entry.disposition === 'select')
		.sort((a, b) => b.weightedScore - a.weightedScore || (a.source.sourcePath < b.source.sourcePath ? -1 : a.source.sourcePath > b.source.sourcePath ? 1 : 0))
		.map((entry, index) => ({ ...entry, recommendedOrder: index + 1 }));
	return {
		schemaVersion: 1 as const, stage: 'B1' as const, status: 'selection-only' as const,
		publicationApproved: false as const, nextStep: 'human-review-before-B2' as const,
		corpusCount: prepared.input.inventory.articles.length, inventoryHash: hashJson(prepared.input.inventory),
		requestHash: hashJson(prepared.request), model: model.identity, weights: PILOT_WEIGHTS,
		screening: prepared.screening,
		deepReads: prepared.reads.map(({ body, ...read }) => ({ ...read, providedCharacters: body.length })),
		ranking, deferred: assessed.filter((entry) => entry.disposition === 'defer'), limitations: analysis.limitations,
		measuredUsage: { tokens: null, modelCost: null, researchHours: null },
	};
}
export type PilotResult = Awaited<ReturnType<typeof runPilotSelection>>;

export function createPilotArtifacts(result: PilotResult) {
	const lines = ['# B1 — dziesięciu kandydatów pilota', '',
		`Status: **selection-only**. ${result.corpusCount} źródła, ${result.deepReads.length} pełnych odczytów, 10 wyborów.`, '',
		'Bez researchu, draftów i publikacji. Ranking nie stanowi human approval dla B2 ani CONTENT.', '',
		'## Metoda', '',
		'Każde kryterium ma skalę 1–5. Wartość edukacyjna, testowalność, jasność zakresu, linkowanie i użyteczność: więcej = lepiej. Ryzyko starzenia/security i koszt researchu: mniej = lepiej. Oceny dotyczą proponowanego ograniczonego zakresu, nie poprawności legacy.', '',
		`Wagi (suma 100): ${Object.entries(result.weights).map(([key, weight]) => `${key}=${weight}`).join(', ')}.`, '',
		'Wynik = suma(waga × ocena korzystna)/5, ryzyka odwrócone jako 6−ocena. Remis: sourcePath rosnąco. To deterministyczny porządek ocen redakcyjnych, nie zmierzona jakość/koszt ani pełny research.', '',
		'## Ranking', '', '| # | Proponowany temat | Wynik / 100 | Koszt | Starzenie | Security |', '| --- | --- | --- | --- | --- | --- |'];
	for (const entry of result.ranking) lines.push(`| ${entry.recommendedOrder} | ${entry.proposedTitle} | ${entry.weightedScore} | ${entry.scores.researchCost} | ${entry.scores.outdatedRisk} | ${entry.scores.securityRisk} |`);
	for (const entry of result.ranking) {
		lines.push('', `## ${entry.recommendedOrder}. ${entry.proposedTitle}`, '', `Źródło: [${entry.source.title ?? entry.source.sourcePath}](../../../temp-ogwo/posts/${entry.source.sourcePath}) · ID ${entry.sourceId} · ${entry.domain}`, '',
			`Dlaczego: ${entry.reason}`, '', `Zakres: ${entry.recommendedScope}`, '',
			`Oceny: ${Object.entries(entry.scores).map(([key, value]) => `${key}=${value}`).join(', ')}.`, '', 'Do sprawdzenia w osobnym researchu:', '');
		for (const need of entry.researchNeeds) lines.push(`- ${need}`);
		lines.push('', `Potencjalne linki (source IDs, nie publiczne URL): ${entry.internalLinkSourceIds.join(', ') || 'brak'}.`, '',
			`SHA-256 źródła: \`${entry.source.contentHash}\`.`);
	}
	lines.push('', '## Odłożona shortlista', '');
	for (const entry of result.deferred) lines.push(`- ${entry.sourceId} — ${entry.source.title}: ${entry.reason}`);
	lines.push('', '## Ograniczenia i następny krok', '');
	for (const limitation of result.limitations) lines.push(`- ${limitation}`);
	lines.push('', 'STOP B1. Następny osobny etap: B2 — wyłącznie rank #1, po decyzji człowieka. Potem ocena pipeline, następne 3 i kolejna ocena przed ostatnimi 6.', '',
		`Request SHA-256: \`${result.requestHash}\`. Inventory SHA-256: \`${result.inventoryHash}\`.`, '',
		'Tokeny, koszt modelu i godziny researchu: null (nie były mierzone).', '');
	return { 'cartography/pilot-selection/ranking.json': stableJson(result), 'reports/pilot-selection-b1.md': lines.join('\n') };
}
