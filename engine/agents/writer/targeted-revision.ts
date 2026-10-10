import { hashBytes } from '../../core/editorial-context.ts';
import type { EditorialInput } from '../../core/editorial-context.ts';
import { hashJson } from '../../core/serialization.ts';
import { CriticReviewSchema } from '../critic/contract.ts';
import { validateDraft } from './validation.ts';
import { renderArticle, wordCount } from './report.ts';

/** One explicit prose replacement, not a model call or autonomous revision loop. */
export function reviseRequiredProse(rawDraft: unknown, rawReview: unknown, input: EditorialInput, issueId: string, replacement: string) {
 const draft = validateDraft(rawDraft, input), review = CriticReviewSchema.parse(rawReview);
 if (review.verdict !== 'REVISE' || review.articleHash !== draft.articleHash || review.draftMetadataHash !== hashJson(draft)
  || review.requiredChanges.length !== 1 || review.requiredChanges[0]!.issueId !== issueId) throw new Error('Revision requires one exact matching required issue.');
 const issue = review.issues.find(item => item.id === issueId);
 if (!issue || issue.category !== 'CLARITY' || issue.severity !== 'required' || replacement.trim().length === 0 || replacement.includes('```')) throw new Error('Only explicit required prose correction allowed.');
 const section = draft.sections.find(item => item.id === issue.location.sectionId);
 const quote = issue.location.quote;
 if (!section || section.body.split(quote).length !== 2) throw new Error('Required prose quote must occur exactly once.');
 const revised = structuredClone(draft);
 revised.sections.find(item => item.id === section.id)!.body = section.body.replace(quote, replacement);
 const article = renderArticle(revised);
 revised.articleHash = hashBytes(article);
 revised.wordCount = wordCount(article);
 if (revised.articleHash === draft.articleHash) throw new Error('Revision must change the required passage.');
 validateDraft(revised, input, article);
 return { draft: revised, article, beforeArticleHash: draft.articleHash, beforeDraftHash: hashJson(draft), issueId, sectionId: section.id, quote, replacement };
}
