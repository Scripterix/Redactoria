import { lstat, readFile, readdir, realpath, open, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';
import { z } from 'zod';
import { editorialBasis, hashBytes, type EditorialInput } from '../core/editorial-context.ts';
import { hashJson, stableJson } from '../core/serialization.ts';
import { validateCriticReview } from '../agents/critic/validation.ts';
import { topicSchema } from '../../src/lib/content-schema.ts';
import { AnyPublicationCandidateSchema, AnyPublicationDecisionSchema, CandidateRef, ContentMetadataSchema, DecisionRef } from './contract.ts';

/** No model, agents, git or deploy. Every read and write is narrowly scoped. */
export async function promote(options: {
 project: string; candidate: string; decision: string;
 loadEditorial: (topic: string) => Promise<EditorialInput>;
}) {
 const root = await realpath(options.project);
 CandidateRef.parse(options.candidate); DecisionRef.parse(options.decision);
 async function scoped(path: string, missingLeaf = false) {
  if (!/^(lab|content)\/[a-zA-Z0-9/_.-]+$/.test(path) || path.split('/').some(part => part === '.' || part === '..')) throw new Error('Path outside promotion scope.');
  const parts = path.split('/'); let current = root;
  for (const [index, part] of parts.entries()) {
   current = join(current, part);
   try {
    const info = await lstat(current);
    if (info.isSymbolicLink()) throw new Error('Promotion refuses symlinks/junctions.');
   } catch (error) {
    if (missingLeaf && index === parts.length - 1 && (error as NodeJS.ErrnoException).code === 'ENOENT') return current;
    throw error;
   }
  }
  return current;
 }
 async function text(path: string) {
  const file = await scoped(path), info = await lstat(file);
  if (!info.isFile() || info.size > 1500000) throw new Error('Invalid promotion input file/budget.');
  return readFile(file, 'utf8');
 }
 const candidateText = await text(options.candidate);
 const candidate = AnyPublicationCandidateSchema.parse(JSON.parse(candidateText));
 const decisionText = await text(options.decision);
 const decision = AnyPublicationDecisionSchema.parse(JSON.parse(decisionText));
 if (candidate.schemaVersion !== decision.schemaVersion) throw new Error('Candidate and publication decision schema versions do not match.');
 if (decision.candidateRef !== options.candidate || decision.candidateHash !== hashBytes(candidateText)
  || decision.articleHash !== candidate.articleHash || decision.criticReviewRef !== candidate.criticReviewRef
  || decision.criticReviewHash !== candidate.criticReviewHash) throw new Error('Human approval does not bind this exact candidate/review.');
 if (options.candidate !== 'lab/candidates/' + candidate.topic + '/article.json'
  || candidate.draftMetadataRef !== 'lab/drafts/' + candidate.topic + '/article.json'
  || candidate.draftRef !== 'lab/drafts/' + candidate.topic + '/article.md'
  || candidate.criticReviewRef !== 'lab/reviews/' + candidate.topic + '/critic-review.json'
  || candidate.revisionRef !== 'lab/drafts/' + candidate.topic + '/revision.json') throw new Error('Unexpected candidate provenance paths.');

 const article = await text(options.candidate.replace(/\.json$/, '.md'));
 const draftText = await text(candidate.draftMetadataRef), draft = JSON.parse(draftText);
 const reviewText = await text(candidate.criticReviewRef), review = JSON.parse(reviewText);
 const revisionText = await text(candidate.revisionRef);
 if (hashBytes(article) !== candidate.articleHash || article !== await text(candidate.draftRef)
  || hashBytes(draftText) !== candidate.draftMetadataHash || hashBytes(reviewText) !== candidate.criticReviewHash
  || hashBytes(revisionText) !== candidate.revisionHash || stableJson(draft) !== stableJson(candidate.reviewedDraft)) throw new Error('Changed candidate, draft, review or revision hash.');
 const editorial = await options.loadEditorial(candidate.topic), basis = editorialBasis(editorial);
 // All approved artifacts are re-read from disk, not trusted from a recorded model request.
 for (const artifact of editorial.artifacts) if (await text(artifact.path) !== artifact.contents) throw new Error('Stale editorial artifact: ' + artifact.path);
 const codeExecution = JSON.parse(await text('lab/drafts/' + candidate.topic + '/code-execution.json'));
 const criticInput = { editorial, draft, article, draftRef: candidate.draftRef, codeExecution };
 const validatedReview = validateCriticReview(review, criticInput);
 if (validatedReview.verdict !== 'PASS' || validatedReview.requiredChanges.length
  || candidate.title !== draft.title || candidate.topic !== draft.topic || candidate.wordCount !== draft.wordCount
  || stableJson(candidate.targetPhpVersions) !== stableJson(draft.targetPhpVersions)
  || (candidate.schemaVersion === 1 ? candidate.mergeDecision : candidate.sourceDecision) !== editorial.config.sourceDecision
  || (candidate.schemaVersion === 1 ? candidate.mergeDecision : candidate.sourceDecision) !== draft.sourceDecision
  || candidate.researchApproval !== editorial.config.researchApproval || candidate.researchApproval !== draft.researchApproval
  || candidate.researchPacket !== editorial.config.researchPacket || candidate.researchPacket !== draft.researchPacket
  || candidate.runtimeVerification !== editorial.config.runtimeVerification || candidate.runtimeVerification !== draft.runtimeVerification) throw new Error('Candidate provenance/approval/PASS mismatch.');
 if (candidate.schemaVersion === 1) {
  const revision = z.object({ status: z.literal('applied-reviewed'), revisedArticleHash: z.string(),
   criticSecondPass: z.object({ verdict: z.literal('PASS'), reviewHash: z.string() }) }).parse(JSON.parse(revisionText));
  if (revision.revisedArticleHash !== candidate.articleHash || revision.criticSecondPass.reviewHash !== candidate.criticReviewHash) throw new Error('Revision is not the reviewed version.');
 } else {
  const revision = z.object({ afterArticleHash: z.string(), afterDraftHash: z.string(),
   additionalWriterGenerations: z.literal(0), changedExamples: z.literal(0) }).parse(JSON.parse(revisionText));
  if (revision.afterArticleHash !== candidate.articleHash || revision.afterDraftHash !== candidate.draftMetadataHash) throw new Error('Revision is not the reviewed version.');
 }

 const metadata = ContentMetadataSchema.parse(decision.metadata);
 if (decision.destination !== 'content/articles/' + metadata.slug + '.md' || metadata.title !== candidate.title
  || metadata.status !== 'published' || metadata.review.status !== 'approved' || !metadata.review.reviewer
  || metadata.updated < metadata.created) throw new Error('Invalid local publication metadata.');
 const topicPaths = ['yaml', 'yml', 'json'].map(extension => 'content/topics/' + metadata.topic + '.' + extension);
 let topicFound = false;
 for (const path of topicPaths) {
  try {
   const topic = topicSchema.parse(parse(await text(path)));
   if (topic.slug !== metadata.topic || topic.status !== 'published') throw new Error('Invalid/unpublished target topic.');
   topicFound = true; break;
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
 }
 if (!topicFound) throw new Error('Content Collection topic reference does not exist.');
 async function checkSlugs(directory: string) {
  for (const entry of await readdir(await scoped(directory), { withFileTypes: true })) {
   const path = directory + '/' + entry.name;
   await scoped(path);
   if (entry.isDirectory()) await checkSlugs(path);
   else if (entry.name.endsWith('.md')) {
    const contents = await text(path), match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(contents);
    if (!match) throw new Error('Existing CONTENT has no valid front matter.');
    const existing = ContentMetadataSchema.parse(parse(match[1]!));
    if (existing.slug === metadata.slug) throw new Error('Article slug collision.');
   }
  }
 }
 await checkSlugs('content/articles');
 const auditBase = 'lab/reports/' + metadata.slug + '-promotion';
 const paths = [decision.destination, auditBase + '.json', auditBase + '.md'];
 const targets = await Promise.all(paths.map(async path => {
  const target = await scoped(path, true);
  try { await lstat(target); } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return target; throw error; }
  throw new Error('Promotion refuses to overwrite ' + path);
 }));
 let publicArticle = article;
 const transforms = ['Content Collection YAML front matter'];
 if (decision.schemaVersion === 2 && decision.presentationCleanup) {
  for (const exact of decision.presentationCleanup.removeExact) {
   if (publicArticle.split(exact).length !== 2) throw new Error('Approved presentation note is missing or not unique.');
   publicArticle = publicArticle.replace(exact, '');
   transforms.push('Removed exact human-approved technical LAB/draft note');
  }
 }
 const content = renderPromotedArticle(metadata, publicArticle);
 const sourceDecisionRef = candidate.schemaVersion === 1 ? candidate.mergeDecision : candidate.sourceDecision;
 const record = { schemaVersion: decision.schemaVersion, result: decision.schemaVersion === 1 ? 'PROMOTED_LOCAL' : 'PROMOTED_PUBLIC', scope: decision.scope,
  candidateRef: options.candidate, candidateHash: hashBytes(candidateText), articleHash: hashBytes(article),
  decisionRef: options.decision, decisionHash: hashBytes(decisionText), approvedBy: decision.approvedBy,
  criticReviewRef: candidate.criticReviewRef, criticReviewHash: candidate.criticReviewHash,
  ...(candidate.schemaVersion === 1
   ? { mergeApprovalRef: sourceDecisionRef, mergeApprovalHash: hashJson(basis.decision) }
   : { sourceDecisionRef, sourceDecisionHash: hashJson(basis.decision) }),
  researchApprovalRef: candidate.researchApproval, researchApprovalHash: hashBytes(basis.artifact(candidate.researchApproval)),
  researchPacketRef: candidate.researchPacket, researchPacketHash: basis.approval.packetHash,
  destination: decision.destination, contentHash: hashBytes(content),
  provenance: { sources: draft.sources, approvedArtifacts: draft.approvedArtifacts, writerExecution: draft.writerExecution,
   criticExecution: validatedReview.criticExecution, revisionRef: candidate.revisionRef, revisionHash: candidate.revisionHash },
  localPath: '/artykuly/' + metadata.slug + '/', remotePublicationApproved: decision.remotePublicationApproved,
  transforms,
 };
 const report = '# Promotion audit\n\n' + Object.entries(record).filter(([key]) => !['provenance'].includes(key))
  .map(([key, value]) => '- ' + key + ': ' + (typeof value === 'object' ? JSON.stringify(value) : String(value))).join('\n')
  + '\n\nNo LLM or article regeneration. Git commit, push and deployment remain outside this deterministic gate.\n';
 const outputs = [content, stableJson(record), report], created: string[] = [];
 try {
  for (const [index, target] of targets.entries()) {
   const handle = await open(target, 'wx'); created.push(target);
   try { await handle.writeFile(outputs[index]!, 'utf8'); } finally { await handle.close(); }
  }
 } catch (error) {
  // Only files exclusively created by this operation are eligible for rollback.
  for (const path of created.reverse()) await unlink(path);
  throw error;
 }
 return record;
}

export function renderPromotedArticle(metadata: unknown, article: string) {
 const parsed = ContentMetadataSchema.parse(metadata);
 return '---\n' + stringify(JSON.parse(JSON.stringify(parsed)), { lineWidth: 0 }) + '---\n' + article;
}
