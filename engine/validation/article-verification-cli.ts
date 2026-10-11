import { stableJson } from '../core/serialization.ts';
import {
	ArticleVerificationResultSchema,
	type ArticleVerificationResult,
	type VerificationCheck,
	type VerificationStatus,
} from './article-verification-contract.ts';

export const VERIFY_ARTICLE_EXIT = {
	PASS: 0,
	FAIL: 1,
	INPUT_ERROR: 2,
} as const;

export type VerifyArticleCliResult = {
	exitCode: 0 | 1 | 2;
	stdout: string;
	stderr: string;
};

export function parseVerifyArticleArguments(args: string[]): { topic: string; json: boolean } {
	let topic: string | undefined;
	let json = false;
	for (let index = 0; index < args.length; index++) {
		const argument = args[index]!;
		if (argument === '--json') {
			if (json) throw new Error('Duplicate --json flag.');
			json = true;
		} else if (argument === '--topic') {
			const value = args[++index];
			if (!value || value.startsWith('--')) throw new Error('--topic requires a value.');
			if (topic) throw new Error('Duplicate --topic flag.');
			topic = value;
		} else {
			throw new Error(`Unknown argument: ${argument}.`);
		}
	}
	if (!topic) throw new Error('--topic is required.');
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic)) throw new Error('Invalid topic format.');
	return { topic, json };
}

function combinedStatus(checks: VerificationCheck[]): VerificationStatus {
	if (checks.some(item => item.status === 'FAIL')) return 'FAIL';
	if (checks.every(item => item.status === 'NOT_APPLICABLE')) return 'NOT_APPLICABLE';
	return 'PASS';
}

function line(label: string, status: VerificationStatus): string {
	return `  ${label.padEnd(22)} ${status}`;
}

/** Stable concise operator view; machine mode returns the contract itself. */
export function formatArticleVerification(result: ArticleVerificationResult): string {
	const areas = result.areas;
	const groups: { title: string; rows: [string, VerificationCheck[]][] }[] = [
		{ title: 'SOURCE', rows: [
			['provenance', [areas.source.checks.exists, areas.source.checks.reference, areas.source.checks.protection]],
			['hash', [areas.source.checks.hash]],
		] },
		{ title: 'CARTOGRAPHY', rows: [
			['decision', Object.values(areas.cartography.checks)],
		] },
		{ title: 'RESEARCH', rows: [
			['packet', [areas.research.checks.packet, areas.research.checks.approval]],
			['evidence', [areas.research.checks.evidence, areas.research.checks.hashes]],
		] },
		{ title: 'RUNTIME', rows: [
			['evidence', Object.values(areas.runtime.checks)],
		] },
		{ title: 'WRITER', rows: [
			['draft lineage', Object.values(areas.writer.checks)],
		] },
		{ title: 'CRITIC', rows: [
			['final verdict', [areas.critic.checks.finalReview, areas.critic.checks.verdict, areas.critic.checks.unresolvedChanges]],
			['reviewed hash', [areas.critic.checks.reviewedHash]],
		] },
		{ title: 'CANDIDATE', rows: [
			['schema', [areas.candidate.checks.exists, areas.candidate.checks.schema]],
			['integrity', [areas.candidate.checks.integrity, areas.candidate.checks.reviewedVersion, areas.candidate.checks.publicationFlags]],
		] },
		{ title: 'PUBLICATION', rows: [
			['decision', [areas.publication.checks.decision, areas.publication.checks.humanApproval]],
			['promotion audit', [areas.publication.checks.promotionAudit]],
			['content lineage', [areas.publication.checks.contentLineage]],
			['current content', [areas.publication.checks.contentIntegrity]],
		] },
	];
	const output = [`Article: ${result.topic}`, ''];
	for (const group of groups) {
		output.push(group.title, ...group.rows.map(([label, checks]) => line(label, combinedStatus(checks))), '');
	}
	output.push('OVERALL', `  ${result.overall}`);
	const failures = Object.entries(areas).flatMap(([areaName, area]) =>
		Object.entries(area.checks).flatMap(([checkName, check]) => check.status === 'FAIL'
			? [`  ${areaName.toUpperCase()}.${checkName}: ${check.detail}`]
			: []));
	if (failures.length) output.push('', 'FAILURES', ...failures);
	return output.join('\n') + '\n';
}

export async function runVerifyArticleCli(
	args: string[],
	verify: (topic: string) => Promise<ArticleVerificationResult>,
): Promise<VerifyArticleCliResult> {
	try {
		const options = parseVerifyArticleArguments(args);
		const result = ArticleVerificationResultSchema.parse(await verify(options.topic));
		return {
			exitCode: result.overall === 'PASS' ? VERIFY_ARTICLE_EXIT.PASS : VERIFY_ARTICLE_EXIT.FAIL,
			stdout: options.json ? stableJson(result) : formatArticleVerification(result),
			stderr: '',
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return {
			exitCode: VERIFY_ARTICLE_EXIT.INPUT_ERROR,
			stdout: '',
			stderr: `verify:article: ${message}\nUsage: npm run verify:article -- --topic <topic> [--json]\n`,
		};
	}
}
