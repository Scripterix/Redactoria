import { createHash } from 'node:crypto';
import { z } from 'zod';
import { DeepReadSchema } from '../agents/cartographer/contract.ts';
import { FocusedMergeResultSchema } from '../agents/cartographer/focused-merge.ts';
import { ApprovedMergeDecisionSchema, ResearchPacketSchema, ProbeSchema } from '../agents/researcher/contract.ts';
import { findings } from '../agents/researcher/validation.ts';
import { hashJson, stableJson } from './serialization.ts';

export const Text = z.string().trim().min(1);
export const Sha = z.string().regex(/^[a-f0-9]{64}$/);
export const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const LabRef = z.string().regex(/^lab\/(decisions|cartography|research|drafts|reviews|inventory)\/[a-zA-Z0-9/_-]+\.(json|md)$/);
export const PhpVersions = z.tuple([z.literal('8.4'), z.literal('8.5')]);
export const ModelIdentitySchema = z.strictObject({ adapter: Text, model: Text, mode: z.enum(['imported-session-analysis', 'live', 'test']) });
const target = ApprovedMergeDecisionSchema.shape.targets;
export const ResearchApprovalSchema = z.strictObject({
 schemaVersion: z.literal(1), status: z.literal('approved'), approvedBy: z.literal('human'),
 approvedAt: z.iso.datetime(), nextStep: z.literal('writer'), scope: Text, topic: Text,
 packetRef: LabRef, packetHash: Sha, targets: target, requestHash: Sha, inputHash: Sha,
 provenance: ModelIdentitySchema,
 evidence: z.strictObject({ humanApproval: Text, artifacts: z.array(z.strictObject({ path: LabRef, sha256: Sha })).min(1),
  runtimeVerification: z.strictObject({ ref: LabRef, status: z.literal('PASS'),
   versions: z.array(z.strictObject({ version: Text, status: z.literal('PASS'), assertions: z.number().int().positive(), probes: z.number().int().positive() })).length(2) }) }),
 requiredAddenda: z.array(z.strictObject({ ref: LabRef, findingId: Text, instruction: Text })),
 resolvedQuestionIds: z.array(Text), remainingWriterBoundary: Text,
});
export const TopicConfigSchema = z.strictObject({
 schemaVersion: z.literal(1), topic: Slug, sourceDecision: LabRef, researchApproval: LabRef,
 researchPacket: LabRef, runtimeVerification: LabRef, targetPhpVersions: PhpVersions,
 audience: Text, requiredCoverage: z.array(Slug).min(1),
});
export const EditorialInputSchema = z.strictObject({
 config: TopicConfigSchema, artifacts: z.array(z.strictObject({ path: LabRef, contents: z.string().max(1500000) })).min(1).max(24),
 sources: z.array(DeepReadSchema).length(2),
});
export type EditorialInput = z.infer<typeof EditorialInputSchema>;
export const EvidenceRefSchema = z.strictObject({ kind: z.enum(['finding', 'addendum']), id: Text });
export type EvidenceRef = z.infer<typeof EvidenceRefSchema>;
export function hashBytes(value: string | Uint8Array) { return createHash('sha256').update(value).digest('hex'); }
export function unique(values: string[], label: string) {
 if (new Set(values).size !== values.length) throw new Error('Duplicate ' + label + '.');
}
export function editorialBasis(raw: unknown) {
 const input = EditorialInputSchema.parse(raw);
 unique(input.artifacts.map(item => item.path), 'artifact paths');
 unique(input.config.requiredCoverage, 'required coverage');
 const artifact = (path: string) => {
  const item = input.artifacts.find(entry => entry.path === path);
  if (!item) throw new Error('Missing approved artifact: ' + path);
  return item.contents;
 };
 const approval = ResearchApprovalSchema.parse(JSON.parse(artifact(input.config.researchApproval)));
 unique(approval.evidence.artifacts.map(item => item.path), 'approved artifact paths');
 for (const item of approval.evidence.artifacts) if (hashBytes(artifact(item.path)) !== item.sha256) {
  throw new Error('Approved artifact hash mismatch: ' + item.path);
 }
 const decision = ApprovedMergeDecisionSchema.parse(JSON.parse(artifact(input.config.sourceDecision)));
 const research = ResearchPacketSchema.parse(JSON.parse(artifact(input.config.researchPacket)));
 const cartography = FocusedMergeResultSchema.parse(JSON.parse(artifact(decision.analysisRef)));
 if (approval.packetRef !== input.config.researchPacket || approval.packetHash !== hashBytes(artifact(approval.packetRef))
  || approval.requestHash !== research.analysisContext.requestHash || approval.inputHash !== research.analysisContext.inputHash
  || stableJson(approval.provenance) !== stableJson(research.analysisContext.model)
  || research.analysisContext.topicSlug !== input.config.topic || cartography.artifactName !== input.config.topic + '-merge'
  || decision.analysisHash !== hashJson(cartography) || research.analysisContext.cartographyHash !== hashJson(cartography)
  || research.analysisContext.decisionHash !== hashJson(decision)) throw new Error('Approved research provenance mismatch.');
 for (const targets of [research.targets, approval.targets, cartography.targets]) {
  if (stableJson(targets) !== stableJson(decision.targets)) throw new Error('Unknown or changed approved target.');
 }
 unique(input.sources.map(source => source.sourceId), 'source IDs');
 for (const [index, source] of input.sources.entries()) {
  const expected = decision.targets[index]!;
  if (source.sourceId !== expected.sourceId || source.sourcePath !== expected.sourcePath
   || source.contentHash !== expected.contentHash || source.truncated || source.body.length !== expected.providedCharacters) {
   throw new Error('Unknown, changed or truncated source.');
  }
 }
 const runtime = z.object({
  schemaVersion: z.literal(1), status: z.literal('PASS'), packetHash: Sha,
  runs: z.array(z.object({ family: z.enum(['8.4', '8.5']), version: Text, status: z.literal('PASS'),
   execution: z.literal('actual-local-cli'), executableHash: Sha, records: z.array(ProbeSchema).min(1),
   checks: z.array(z.object({ status: z.literal('PASS'), expected: z.unknown(), actual: z.unknown() })).min(1) })).length(2),
  errata: z.array(z.object({ id: Text, claim: Text, source: LabRef, evidenceId: Text, recommendation: Text })),
 }).parse(JSON.parse(artifact(input.config.runtimeVerification)));
 if (approval.evidence.runtimeVerification.ref !== input.config.runtimeVerification || runtime.packetHash !== approval.packetHash) throw new Error('Runtime does not match approved packet.');
 unique(runtime.runs.map(run => run.family), 'runtime families');
 for (const run of runtime.runs) {
  const approved = approval.evidence.runtimeVerification.versions.find(item => item.version === run.version);
  if (!run.version.startsWith(run.family + '.') || !approved || approved.assertions !== run.checks.length
   || approved.probes !== run.records.length || run.checks.some(check => stableJson(check.actual) !== stableJson(check.expected))
   || run.records.some(record => record.phpVersion !== run.version || hashBytes(record.code) !== record.codeHash)) throw new Error('Invalid runtime evidence.');
 }
 for (const item of approval.requiredAddenda) {
  artifact(item.ref);
  if (!runtime.errata.some(erratum => erratum.id === item.findingId)) throw new Error('Required addendum missing.');
 }
 for (const item of runtime.errata) {
  if (!approval.evidence.artifacts.some(entry => entry.path === item.source)) throw new Error('Unapproved runtime source.');
  const document = z.object({ excerpts: z.array(z.object({ id: Text })) }).parse(JSON.parse(artifact(item.source)));
  if (!document.excerpts.some(entry => entry.id === item.evidenceId)) throw new Error('Unknown addendum source evidence.');
 }
 const evidence = (refs: EvidenceRef[]) => {
  if (!refs.length) throw new Error('Research evidence required.');
  unique(refs.map(ref => ref.kind + '/' + ref.id), 'evidence references');
  for (const ref of refs) if (ref.kind === 'finding'
   ? !findings(research).some(finding => finding.id === ref.id)
   : !runtime.errata.some(item => item.id === ref.id && approval.requiredAddenda.some(addendum => addendum.findingId === item.id))) {
   throw new Error('Evidence outside approved Research Packet/addendum.');
  }
 };
 return { input, approval, decision, research, cartography, runtime, artifact, evidence };
}
export type EditorialBasis = ReturnType<typeof editorialBasis>;
export function modelContext(basis: EditorialBasis) {
 return { config: basis.input.config, decision: basis.decision, approval: basis.approval,
  research: basis.research, runtime: basis.runtime,
  runtimeReport: basis.artifact(basis.input.config.runtimeVerification.replace(/\.json$/, '.md')),
  cartographerStructure: basis.cartography.proposedStructure, sources: basis.input.sources };
}

