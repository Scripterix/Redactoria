import { createHash } from 'node:crypto';
import { z } from 'zod';

const Sha = z.string().regex(/^[a-f0-9]{64}$/);
const Text = z.string().trim().min(1);

export const B5_AUTHORIZATION_REF = 'lab/decisions/b5-authorization.json' as const;
export const B5_TOPICS = ['git-local-basics', 'curl-http-basics', 'python-fundamentals'] as const;

export const B5JobSchema = z.strictObject({
	order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	b1Rank: z.union([z.literal(8), z.literal(9), z.literal(10)]),
	topic: z.enum(B5_TOPICS),
	origin: z.enum(['MODERNIZE', 'MERGE', 'CREATE_NEW']),
	source: z.strictObject({
		sourceId: Text,
		sourcePath: Text,
		contentHash: Sha,
		originalUrl: z.url(),
		title: Text,
	}),
});

/** Exact human authorization for B5 candidate work, explicitly excluding publication. */
export const B5AuthorizationSchema = z.strictObject({
	schemaVersion: z.literal(1),
	status: z.literal('approved'),
	approvedBy: z.literal('human'),
	approvedAt: z.iso.datetime({ offset: true }),
	recordedAt: z.iso.datetime({ offset: true }),
	scope: Text,
	b1RankingRef: z.literal('lab/cartography/pilot-selection/ranking.json'),
	b1RankingHash: Sha,
	queueVerificationRef: z.literal('lab/reports/b5-queue-verification.json'),
	queueVerificationHash: Sha,
	authorization: Text,
	researchAcceptance: z.strictObject({
		mode: z.literal('validation-under-human-task-authorization'),
		humanReviewedPacket: z.literal(false),
		writerAfterValidatedPacket: z.literal(true),
		clarification: Text,
	}),
	jobs: z.array(B5JobSchema).length(3),
	allowedStages: z.array(Text),
	publicationApproved: z.literal(false),
	contentWriteApproved: z.literal(false),
	gitApproved: z.literal(false),
	deploymentApproved: z.literal(false),
	otherRanksApproved: z.literal(false),
});

export function validateB5Authorization(
	contents: string,
	expectedHash: string,
	topic: string,
	targets: { sourceId: string; sourcePath: string; contentHash: string }[],
) {
	const record = B5AuthorizationSchema.parse(JSON.parse(contents));
	const job = record.jobs.find(item => item.topic === topic);
	const requiredStages = ['cartographer', 'research', 'writer', 'runtime-verification', 'critic', 'publication-candidate'];
	if (createHash('sha256').update(contents).digest('hex') !== expectedHash
		|| !job || targets.length !== 1
		|| targets[0]!.sourceId !== job.source.sourceId
		|| targets[0]!.sourcePath !== job.source.sourcePath
		|| targets[0]!.contentHash !== job.source.contentHash
		|| requiredStages.some(stage => !record.allowedStages.includes(stage))) {
		throw new Error('B5 authorization hash, topic, target or allowed stages mismatch.');
	}
	if (record.jobs.some((item, index) => item.order !== index + 1 || item.b1Rank !== index + 8)
		|| new Set(record.jobs.map(item => item.topic)).size !== 3
		|| new Set(record.jobs.map(item => item.source.sourceId)).size !== 3) {
		throw new Error('B5 jobs must remain the three distinct ordered B1 ranks 8–10.');
	}
	return { record, job };
}
