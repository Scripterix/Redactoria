import { createHash } from 'node:crypto';
import { z } from 'zod';

const Sha = z.string().regex(/^[a-f0-9]{64}$/);
const Text = z.string().trim().min(1);
const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const B3JobSchema = z.strictObject({
	order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	topic: Slug,
	source: z.strictObject({
		sourceId: Text,
		sourcePath: Text,
		contentHash: Sha,
		originalUrl: z.url(),
		title: Text,
	}),
});

/** One human authorization for three sequential LAB-only B3 jobs, never publication. */
export const B3AuthorizationSchema = z.strictObject({
	schemaVersion: z.literal(1),
	status: z.literal('approved'),
	approvedBy: z.literal('human'),
	approvedAt: z.iso.datetime().nullable(),
	recordedAt: z.iso.datetime(),
	scope: Text,
	b1RankingRef: z.literal('lab/cartography/pilot-selection/ranking.json'),
	b1RankingHash: Sha,
	authorization: Text,
	researchAcceptance: z.strictObject({
		mode: z.literal('validation-under-human-task-authorization'),
		humanReviewedPacket: z.literal(false),
		writerAfterValidatedPacket: z.literal(true),
		clarification: Text,
	}),
	jobs: z.array(B3JobSchema).length(3),
	allowedStages: z.array(Text),
	publicationApproved: z.literal(false),
	contentWriteApproved: z.literal(false),
	gitApproved: z.literal(false),
	deploymentApproved: z.literal(false),
	otherRanksApproved: z.literal(false),
});

export function validateB3Authorization(
	contents: string,
	expectedHash: string,
	topic: string,
	targets: { sourceId: string; sourcePath: string; contentHash: string }[],
) {
	const record = B3AuthorizationSchema.parse(JSON.parse(contents));
	const job = record.jobs.find((item) => item.topic === topic);
	if (createHash('sha256').update(contents).digest('hex') !== expectedHash
		|| !job
		|| targets.length !== 1
		|| targets[0]!.sourceId !== job.source.sourceId
		|| targets[0]!.sourcePath !== job.source.sourcePath
		|| targets[0]!.contentHash !== job.source.contentHash
		|| ['cartographer', 'research', 'writer', 'critic', 'publication-candidate'].some((stage) => !record.allowedStages.includes(stage))) {
		throw new Error('B3 authorization hash, topic, target or allowed stages mismatch.');
	}
	if (new Set(record.jobs.map((item) => item.order)).size !== 3
		|| new Set(record.jobs.map((item) => item.topic)).size !== 3
		|| new Set(record.jobs.map((item) => item.source.sourceId)).size !== 3) {
		throw new Error('B3 jobs must remain three distinct ordered scopes.');
	}
	return { record, job };
}
