import type { ResearchAnalysis, ResearcherInput } from '../contract.ts';
import { DEFAULT_RESEARCH_LIMITS } from '../policies.ts';
import { hashJson } from '../../../core/serialization.ts';
import { sampleInput, titleEvidence } from '../../cartographer/__tests__/helpers.ts';
export { FakeLanguageModel, fixturesDirectory } from '../../cartographer/__tests__/helpers.ts';

export function inputFixture(): ResearcherInput {
	const inventory = sampleInput().inventory;
	const targets = inventory.articles.map(article => ({ sourceId: article.source_id, sourcePath: article.source_path,
		title: article.title, contentHash: article.content_hash, providedCharacters: 37, truncated: false as const }));
	const cartography: ResearcherInput['cartography'] = { schemaVersion: 1, task: 'MERGE', artifactName: 'fixture-merge',
		recommended: true, confidence: 0.9, reason: 'Complementary materials.', evidence: [titleEvidence(), titleEvidence(1)],
		sharedTopics: [], uniqueToFirst: [], uniqueToSecond: [], duplicates: [], conflicts: [], logicalOrder: [],
		outdatedOrUncertain: [], keep: [], remove: [], needsResearch: [], proposedTitle: 'Combined lesson',
		proposedStructure: [{ order: 1, title: 'Introduction', purpose: 'Explain the subject',
			sourceIds: targets.map(target => target.sourceId), evidence: [titleEvidence(), titleEvidence(1)], needsResearch: true }],
		limitations: ['Fixture only.'], targets, analysisContext: { selectedInventoryHash: hashJson(inventory), requestHash: '1'.repeat(64),
			model: { adapter: 'fake', model: 'Fixture', mode: 'test' } } };
	return { inventory, cartography, limits: { ...DEFAULT_RESEARCH_LIMITS, allowedDocumentHosts: [...DEFAULT_RESEARCH_LIMITS.allowedDocumentHosts] },
		decision: { schemaVersion: 1, status: 'approved', approvedBy: 'human', nextStep: 'research', action: 'MERGE',
			targets, confidence: 0.9, reason: 'Human accepts research scope.', evidence: [titleEvidence(), titleEvidence(1)],
			analysisHash: hashJson(cartography), analysisRef: 'lab/cartography/fixture-merge.json' },
		research: { schemaVersion: 1, topicSlug: 'fixture', asOfDate: '2026-10-09', provenance: 'Official document fixture; never used for the real pilot.',
			questions: [{ id: 'question', section: 'ARRAY OPERATIONS', question: 'Verify the behavior.', cartographerFindingIds: [] }], probes: [],
			sources: [{ id: 'manual', title: 'Fixture manual', url: 'https://www.php.net/manual/en/language.types.array.php',
				sourceType: 'official-documentation', kind: 'language-reference', retrievedAt: '2026-10-09T10:00:00Z', documentHash: '2'.repeat(64),
				retrieval: { method: 'https-get', httpStatus: 200, finalUrl: 'https://www.php.net/manual/en/language.types.array.php', selection: 'official-content-excluding-user-notes' },
				excerpts: [{ id: 'rule', text: 'ordered map', locator: 'Description' }] }] } };
}
export function analysisFixture(): ResearchAnalysis {
	return { action: 'RESEARCH_PACKET', topic: 'Fixture',
		environment: { phpVersionScope: 'Documentation scope only; no PHP execution.', asOfDate: '2026-10-09', evidence: [{ documentId: 'manual', excerptId: 'rule' }] },
		verifiedFacts: [{ id: 'fact', questionIds: ['question'], claim: 'Documented fixture fact.', sourceType: 'official-documentation',
			status: 'verified', evidence: [{ documentId: 'manual', excerptId: 'rule' }], articleEvidence: [], confidence: 1, recommendation: 'Keep.' }],
		outdatedClaims: [], incorrectClaims: [], ambiguousClaims: [], securityNotes: [], codeReview: [],
		recommendations: [{ id: 'recommendation', action: 'KEEP', instruction: 'Keep the verified example.', findingIds: ['fact'] }],
		questionAnswers: [{ questionId: 'question', status: 'resolved', findingIds: ['fact'], note: 'Supported by supplied documentation.' }],
		unresolvedQuestions: [], writerHandoff: { keep: [], correct: [], avoid: [], caution: [], verifiedCodeFindingIds: [] }, limitations: ['Test fixture only.'] };
}
export function authorityInputFixture(): ResearcherInput {
	const input = structuredClone(inputFixture()) as any;
	const legacy = input.research.sources[0];
	input.research = { ...input.research, schemaVersion: 3, probes: [], sources: [{
		...legacy, sourceType: 'authority-ladder', kind: 'project-documentation', authorityTier: 2,
		authorityClass: 'official-project-runtime', evidenceRole: 'technical-authority',
		retrieval: { ...legacy.retrieval, selection: 'authoritative-content' },
	}, {
		...legacy, id: 'problem', title: 'Fixture real-world question', url: 'https://stackoverflow.com/questions/1/example',
		documentHash: '3'.repeat(64), sourceType: 'authority-ladder', kind: 'problem-report', authorityTier: 7,
		authorityClass: 'real-world-problem', evidenceRole: 'problem-signal',
		retrieval: { ...legacy.retrieval, finalUrl: 'https://stackoverflow.com/questions/1/example', selection: 'reviewed-problem-content' },
		excerpts: [{ id: 'symptom', text: 'A representative problem report.', locator: 'Question' }],
	}] };
	return input;
}
export function authorityAnalysisFixture(): ResearchAnalysis {
	const analysis = structuredClone(analysisFixture());
	analysis.verifiedFacts[0]!.sourceType = 'authority-ladder';
	return analysis;
}
export const readerFixture = async (article: ResearcherInput['inventory']['articles'][number]) => ({
	sourceId: article.source_id, sourcePath: article.source_path, contentHash: article.content_hash,
	body: 'Complete fixture body for inspection.', truncated: false,
});
