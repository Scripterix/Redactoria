import { createHash } from 'node:crypto';
import { z } from 'zod';
import { validateB3Authorization } from './b3-authorization.ts';
import { B5_AUTHORIZATION_REF, validateB5Authorization } from './b5-authorization.ts';

const Sha = z.string().regex(/^[a-f0-9]{64}$/);
const Text = z.string().trim().min(1);
export const B4_AUTHORIZATION_REF = 'lab/decisions/b4-authorization.json' as const;
export const B4_TOPICS = ['markdown', 'javascript-calculator', 'api-http-json'] as const;

export const B4JobSchema = z.strictObject({
	order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	b1Rank: z.union([z.literal(5), z.literal(6), z.literal(7)]),
	topic: z.enum(B4_TOPICS),
	origin: z.enum(['MODERNIZE', 'MERGE', 'CREATE_NEW']),
	source: z.strictObject({
		sourceId: Text,
		sourcePath: Text,
		contentHash: Sha,
		originalUrl: z.url(),
		title: Text,
	}),
});

/** Exact human authorization for the three sequential B4 publication lifecycles. */
export const B4AuthorizationSchema = z.strictObject({
	schemaVersion: z.literal(1),
	status: z.literal('approved'),
	approvedBy: z.literal('human'),
	approvedAt: z.iso.datetime(),
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
	jobs: z.array(B4JobSchema).length(3),
	allowedStages: z.array(Text),
	publicationApproved: z.literal(true),
	contentWriteApproved: z.literal(true),
	gitApproved: z.literal(true),
	deploymentApproved: z.literal(true),
	otherRanksApproved: z.literal(false),
});

export function validateB4Authorization(
	contents: string,
	expectedHash: string,
	topic: string,
	targets: { sourceId: string; sourcePath: string; contentHash: string }[],
) {
	const record = B4AuthorizationSchema.parse(JSON.parse(contents));
	const job = record.jobs.find(item => item.topic === topic);
	const requiredStages = ['cartographer', 'research', 'writer', 'runtime-verification', 'critic',
		'publication-candidate', 'publication-decision', 'promotion', 'post-promotion-verification', 'git', 'deployment'];
	if (createHash('sha256').update(contents).digest('hex') !== expectedHash
		|| !job || targets.length !== 1
		|| targets[0]!.sourceId !== job.source.sourceId
		|| targets[0]!.sourcePath !== job.source.sourcePath
		|| targets[0]!.contentHash !== job.source.contentHash
		|| requiredStages.some(stage => !record.allowedStages.includes(stage))) {
		throw new Error('B4 authorization hash, topic, target or allowed stages mismatch.');
	}
	if (record.jobs.some((item, index) => item.order !== index + 1 || item.b1Rank !== index + 5)
		|| new Set(record.jobs.map(item => item.topic)).size !== 3
		|| new Set(record.jobs.map(item => item.source.sourceId)).size !== 3) {
		throw new Error('B4 jobs must remain the three distinct ordered B1 ranks 5–7.');
	}
	return { record, job };
}

export function validateBatchAuthorization(
	reference: string,
	contents: string,
	expectedHash: string,
	topic: string,
	targets: { sourceId: string; sourcePath: string; contentHash: string }[],
) {
	if (reference === 'lab/decisions/b3-authorization.json') {
		return validateB3Authorization(contents, expectedHash, topic, targets);
	}
	if (reference === B4_AUTHORIZATION_REF) {
		return validateB4Authorization(contents, expectedHash, topic, targets);
	}
	if (reference === B5_AUTHORIZATION_REF) {
		return validateB5Authorization(contents, expectedHash, topic, targets);
	}
	throw new Error('Unsupported bounded article authorization reference.');
}
