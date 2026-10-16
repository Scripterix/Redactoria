import { createHash } from 'node:crypto';
import { z } from 'zod';

const Sha = z.string().regex(/^[a-f0-9]{64}$/);
const Text = z.string().trim().min(1);

export const B6_AUTHORIZATION_REF = 'lab/decisions/b6-authorization.json' as const;
export const B6_TOPICS = ['php-language-foundation', 'javascript-language-foundation', 'javascript-functions-callbacks'] as const;

export const B6JobSchema = z.strictObject({
	order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	topic: z.enum(B6_TOPICS),
	origin: z.enum(['CREATE_NEW', 'MODERNIZE']),
	cartographerActionExpected: z.enum(['NEW_CONTENT', 'REWRITE']),
	source: z.strictObject({
		sourceId: Text,
		sourcePath: Text,
		contentHash: Sha,
		originalUrl: z.url(),
		title: Text,
		role: Text,
	}),
});

/** Exact human authority for this non-public foundation batch. Context SOURCE may support a NEW_CONTENT decision. */
export const B6AuthorizationSchema = z.strictObject({
	schemaVersion: z.literal(1),
	status: z.literal('approved'),
	approvedBy: z.literal('human'),
	approvedAt: z.iso.datetime({ offset: true }),
	recordedAt: z.iso.datetime({ offset: true }),
	scope: Text,
	selectionRef: z.literal('lab/reports/next-batch-selection.json'),
	selectionHash: Sha,
	authorization: Text,
	researchAcceptance: z.strictObject({
		mode: z.literal('validation-under-human-task-authorization'),
		humanReviewedPacket: z.literal(false),
		writerAfterValidatedPacket: z.literal(true),
		clarification: Text,
	}),
	jobs: z.array(B6JobSchema).length(3),
	allowedStages: z.array(Text),
	publicationApproved: z.literal(false),
	contentWriteApproved: z.literal(false),
	gitApproved: z.literal(false),
	deploymentApproved: z.literal(false),
	otherTopicsApproved: z.literal(false),
});

export function validateB6Authorization(
	contents: string,
	expectedHash: string,
	topic: string,
	targets: { sourceId: string; sourcePath: string; contentHash: string }[],
) {
	const record = B6AuthorizationSchema.parse(JSON.parse(contents));
	const job = record.jobs.find((item) => item.topic === topic);
	const requiredStages = ['cartographer', 'research', 'writer', 'runtime-verification', 'critic', 'publication-candidate'];
	if (createHash('sha256').update(contents).digest('hex') !== expectedHash
		|| !job || targets.length !== 1
		|| targets[0]!.sourceId !== job.source.sourceId
		|| targets[0]!.sourcePath !== job.source.sourcePath
		|| targets[0]!.contentHash !== job.source.contentHash
		|| requiredStages.some((stage) => !record.allowedStages.includes(stage))) {
		throw new Error('B6 authorization hash, topic, context source or allowed stages mismatch.');
	}
	if (record.jobs.some((item, index) => item.order !== index + 1)
		|| new Set(record.jobs.map((item) => item.topic)).size !== 3
		|| new Set(record.jobs.map((item) => item.source.sourceId)).size !== 3) {
		throw new Error('B6 jobs must remain three distinct ordered foundation scopes.');
	}
	return { record, job };
}
