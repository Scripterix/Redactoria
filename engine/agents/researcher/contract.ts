import { z } from 'zod';
import { EvidenceSchema, InventoryInputSchema } from '../cartographer/contract.ts';
import { FocusedMergeResultSchema, MergeProposalSchema } from '../cartographer/focused-merge.ts';
import { ApprovedArticleDecisionSchema, FocusedArticleResultSchema } from '../cartographer/focused-article.ts';
import { ResearchLimitsSchema, SourceAuthorityClassSchema, SourceAuthorityTierSchema, SourceEvidenceRoleSchema } from './policies.ts';

const text = z.string().min(1).refine(value => value.trim().length > 0, 'Nonblank text required');
const sha = z.string().regex(/^[a-f0-9]{64}$/);
const ids = z.array(text).min(1);
const confidence = z.number().min(0).max(1);
const docEvidence = z.strictObject({ documentId: text, excerptId: text });
export const DocumentEvidenceSchema = docEvidence;
const documentCore = {
	id: text, title: text, url: z.url(),
	retrievedAt: z.iso.datetime(), documentHash: sha,
	retrieval: z.strictObject({ method: z.literal('https-get'), httpStatus: z.literal(200), finalUrl: z.url(),
		selection: z.literal('official-content-excluding-user-notes') }),
	excerpts: z.array(z.strictObject({ id: text, text: text, locator: text })).min(1),

};
export const DocumentSchema = z.strictObject({
	...documentCore, sourceType: z.literal('official-documentation'),
	kind: z.enum(['manual', 'language-reference', 'migration', 'support-lifecycle']),
});
export const AuthorityDocumentSchema = z.strictObject({
	...documentCore, sourceType: z.literal('authority-ladder'),
	retrieval: z.strictObject({ method: z.literal('https-get'), httpStatus: z.literal(200), finalUrl: z.url(),
		selection: z.enum(['authoritative-content', 'practical-content', 'reviewed-problem-content']) }),
	kind: z.enum(['specification', 'standard', 'project-documentation', 'runtime-documentation',
		'web-platform-reference', 'implementation-documentation', 'compatibility-data', 'educational-guide', 'problem-report']),
	authorityTier: SourceAuthorityTierSchema, authorityClass: SourceAuthorityClassSchema, evidenceRole: SourceEvidenceRoleSchema,
});
export const ProbeSchema = z.strictObject({
	id: text, description: text, phpVersion: text, code: text, codeHash: sha,
	result: z.unknown(), diagnostics: z.array(z.strictObject({ level: z.number().int(), message: text })),
});
export const RuntimeProbeSchema = z.strictObject({
	id: text, description: text, runtimeId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), runtimeVersion: text,
	code: text, codeHash: sha, result: z.unknown(), diagnostics: z.array(text),
});
export const ResearchBundleV1Schema = z.strictObject({
	schemaVersion: z.literal(1), topicSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	asOfDate: z.iso.date(), provenance: text,
	questions: z.array(z.strictObject({ id: text, section: text, question: text, cartographerFindingIds: z.array(text) })).min(1),
	sources: z.array(DocumentSchema).min(1), probes: z.array(ProbeSchema),
});
export const ResearchBundleV2Schema = z.strictObject({
	schemaVersion: z.literal(2), topicSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	asOfDate: z.iso.date(), provenance: text,
	questions: z.array(z.strictObject({ id: text, section: text, question: text, cartographerFindingIds: z.array(text) })).min(1),
	sources: z.array(DocumentSchema).min(1), probes: z.array(RuntimeProbeSchema),
});
export const ResearchBundleV3Schema = z.strictObject({
	schemaVersion: z.literal(3), topicSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	asOfDate: z.iso.date(), provenance: text,
	questions: z.array(z.strictObject({ id: text, section: text, question: text, cartographerFindingIds: z.array(text) })).min(1),
	sources: z.array(AuthorityDocumentSchema).min(1), probes: z.array(RuntimeProbeSchema),
});
export const ResearchBundleSchema = z.union([ResearchBundleV1Schema, ResearchBundleV2Schema, ResearchBundleV3Schema]);
export const ApprovedMergeDecisionSchema = MergeProposalSchema.extend({
	status: z.literal('approved'), approvedBy: z.literal('human'), approvedAt: z.iso.datetime().optional(), nextStep: z.literal('research'),
});
export const ResearcherInputSchema = z.strictObject({
	decision: z.union([ApprovedMergeDecisionSchema, ApprovedArticleDecisionSchema]), cartography: z.union([FocusedMergeResultSchema, FocusedArticleResultSchema]),
	inventory: InventoryInputSchema, research: ResearchBundleSchema, limits: ResearchLimitsSchema,
});
export type ResearcherInput = z.infer<typeof ResearcherInputSchema>;
export type ResearchBundle = z.infer<typeof ResearchBundleSchema>;

const finding = z.strictObject({
	id: text, questionIds: ids, claim: text, sourceType: z.enum(['official-documentation', 'authority-ladder']),
	status: z.enum(['verified', 'needs-review']), evidence: z.array(docEvidence),
	articleEvidence: z.array(EvidenceSchema), confidence, recommendation: text,
});
const instruction = z.strictObject({ instruction: text, findingIds: ids });
export const ResearchAnalysisSchema = z.strictObject({
	action: z.literal('RESEARCH_PACKET'), topic: text,
	environment: z.union([
		z.strictObject({ phpVersionScope: text, asOfDate: z.iso.date(), evidence: z.array(docEvidence).min(1) }),
		z.strictObject({ runtimeScope: text, asOfDate: z.iso.date(), evidence: z.array(docEvidence).min(1) }),
	]),
	verifiedFacts: z.array(finding.extend({ status: z.literal('verified'), evidence: z.array(docEvidence).min(1) })).min(1),
	outdatedClaims: z.array(finding), incorrectClaims: z.array(finding), ambiguousClaims: z.array(finding), securityNotes: z.array(finding),
	codeReview: z.array(finding.extend({
		articleEvidence: z.array(EvidenceSchema).min(1),
		verification: z.enum(['documentation-reviewed', 'executed-probe', 'needs-review']), probeIds: z.array(text),
	})),
	recommendations: z.array(z.strictObject({ id: text, action: z.enum(['KEEP', 'CORRECT', 'ADD_CAUTION', 'REMOVE_EXAMPLE', 'NEEDS_REVIEW']), ...instruction.shape })).min(1),
	questionAnswers: z.array(z.strictObject({ questionId: text, status: z.enum(['resolved', 'needs-review']), findingIds: z.array(text), note: text })).min(1),
	unresolvedQuestions: z.array(z.strictObject({ questionId: text, status: z.literal('needs-review'), reason: text })),
	writerHandoff: z.strictObject({ keep: z.array(instruction), correct: z.array(instruction), avoid: z.array(instruction),
		caution: z.array(instruction), verifiedCodeFindingIds: z.array(text) }),
	limitations: z.array(text).min(1),
});
export type ResearchAnalysis = z.infer<typeof ResearchAnalysisSchema>;
export const RegisteredSourceSchema = z.union([
	DocumentSchema.omit({ excerpts: true }).extend({ evidenceIds: ids }),
	AuthorityDocumentSchema.omit({ excerpts: true }).extend({ evidenceIds: ids }),
]);
export const ResearchPacketSchema = ResearchAnalysisSchema.extend({
	schemaVersion: z.literal(1), targets: z.union([MergeProposalSchema.shape.targets, FocusedArticleResultSchema.shape.targets]),
	sourceRegister: z.array(RegisteredSourceSchema).min(1),
	analysisContext: z.strictObject({ inputHash: sha, requestHash: sha, decisionHash: sha, cartographyHash: sha, researchBundleHash: sha,
		topicSlug: text, model: z.strictObject({ adapter: text, model: text, mode: z.enum(['imported-session-analysis', 'live', 'test']) }),
		fullReadCount: z.union([z.literal(2), z.literal(1)]), probes: z.array(z.union([ProbeSchema.omit({ code: true }), RuntimeProbeSchema.omit({ code: true })])) }),
});
export type ResearchPacket = z.infer<typeof ResearchPacketSchema>;
export type Finding = ResearchAnalysis['verifiedFacts'][number] | ResearchAnalysis['ambiguousClaims'][number];
