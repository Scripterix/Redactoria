import { win32 } from 'node:path';
import { AnalysisSchema, CartographerInputSchema, CoarsePlanSchema } from '../agents/cartographer/contract.ts';
import type { CartographerInput, DeepRead, Evidence } from '../agents/cartographer/contract.ts';

function unique(values: string[], label: string) {
	if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}.`);
}

export function validateInput(raw: unknown): CartographerInput {
	const input = CartographerInputSchema.parse(raw);
	unique(input.inventory.articles.map((article) => article.source_id), 'source IDs');
	unique(input.inventory.articles.map((article) => article.source_path), 'source paths');
	for (const article of input.inventory.articles) {
		const path = article.source_path;
		if (win32.isAbsolute(path) || path.startsWith('/') || path.includes('\\')
			|| path.split('/').some((part) => !part || part === '.' || part === '..' || part.includes(':'))) {
			throw new Error('Source paths must be safe relative POSIX paths.');
		}
	}
	return input;
}

export function validateCoarsePlan(raw: unknown, input: CartographerInput) {
	const plan = CoarsePlanSchema.parse(raw);
	const articles = new Map(input.inventory.articles.map((article) => [article.source_id, article]));
	for (const group of [...plan.possibleDomains, ...plan.initialClusters]) {
		unique(group.articleIds, 'group article references');
		for (const sourceId of group.articleIds) if (!articles.has(sourceId)) throw new Error('Unknown source reference.');
	}
	unique(plan.deepReadRequests.map((request) => request.sourceId), 'deep-read requests');
	if (plan.deepReadRequests.length > input.limits.maxDeepReads) throw new Error('Deep-read budget exceeded.');
	for (const request of plan.deepReadRequests) {
		const article = articles.get(request.sourceId);
		if (!article || article.parse_status === 'error') throw new Error('Invalid deep-read source reference.');
	}
	return plan;
}

/** Shared citation fidelity check; semantic conclusions still require review. */
export function assertEvidence(evidence: Evidence[], input: CartographerInput, reads: DeepRead[]) {
	const articles = new Map(input.inventory.articles.map((article) => [article.source_id, article]));
	const bodies = new Map(reads.map((read) => [read.sourceId, read]));
	for (const item of evidence) {
		const article = articles.get(item.sourceId);
		if (!article || item.sourcePath !== article.source_path) throw new Error('Evidence source does not match inventory.');
		if (item.field === 'body') {
			const read = bodies.get(item.sourceId);
			if (!read || !read.body.includes(item.value)) throw new Error('Body evidence was not supplied to the model.');
		} else {
			const value = article[item.field];
			const expected = typeof value === 'string' ? value : JSON.stringify(value);
			if (item.value !== expected) throw new Error('Metadata evidence does not match source value.');
		}
	}
}

export function validateAnalysis(raw: unknown, input: CartographerInput, reads: DeepRead[]) {
	const analysis = AnalysisSchema.parse(raw);
	const articles = new Map(input.inventory.articles.map((article) => [article.source_id, article]));
	const domains = new Map(analysis.domains.map((domain) => [domain.id, domain]));
	for (const [label, values] of Object.entries({ domains: analysis.domains, clusters: analysis.clusters,
		gaps: analysis.gaps, candidates: analysis.candidates, observations: analysis.observations })) {
		unique(values.map((item) => item.id), `${label} IDs`);
	}
	function checkArticles(sourceIds: string[]) {
		unique(sourceIds, 'article references');
		for (const sourceId of sourceIds) if (!articles.has(sourceId)) throw new Error('Unknown source reference.');
	}
	for (const domain of analysis.domains) {
		checkArticles(domain.articleIds);
		if (domain.evidence.some((item) => !domain.articleIds.includes(item.sourceId))) throw new Error('Domain evidence must refer to a member article.');
		const seen = new Set([domain.id]);
		let current = domain;
		while (current.parentId !== null) {
			const parent = domains.get(current.parentId);
			if (!parent) throw new Error('Unknown parent domain.');
			if (seen.has(parent.id)) throw new Error('Domain hierarchy contains a cycle.');
			seen.add(parent.id);
			if (current.articleIds.some((id) => !parent.articleIds.includes(id))) throw new Error('Child domain is not a subset of its parent.');
			current = parent;
		}
	}
	for (const cluster of analysis.clusters) {
		checkArticles(cluster.articleIds);
		if (cluster.evidence.some((item) => !cluster.articleIds.includes(item.sourceId))) throw new Error('Cluster evidence must refer to a member article.');
		const domain = domains.get(cluster.domainId);
		if (!domain || cluster.articleIds.some((id) => !domain.articleIds.includes(id))) throw new Error('Cluster is outside its domain.');
	}
	for (const gap of analysis.gaps) if (!domains.has(gap.domainId)) throw new Error('Unknown gap domain.');
	for (const candidate of analysis.candidates) {
		checkArticles(candidate.target.sourceIds);
		const domain = candidate.target.domainId === null ? null : domains.get(candidate.target.domainId);
		if (candidate.target.domainId !== null && !domain) throw new Error('Unknown candidate domain.');
		if (domain && candidate.target.sourceIds.some((id) => !domain.articleIds.includes(id))) throw new Error('Candidate is outside its domain.');
		if (candidate.action === 'NEW_CONTENT') {
			if (candidate.target.kind !== 'new-content' || candidate.target.sourceIds.length || !domain || !candidate.target.proposedTitle) throw new Error('Invalid new-content target.');
		} else if (candidate.target.kind !== 'articles' || !candidate.target.sourceIds.length || candidate.target.proposedTitle !== null) {
			throw new Error('Article action requires existing source targets.');
		}
		if (candidate.action === 'MERGE' && candidate.target.sourceIds.length < 2) throw new Error('MERGE requires at least two articles.');
		if (candidate.action !== 'NEW_CONTENT' && candidate.target.sourceIds.some((sourceId) => !candidate.evidence.some((item) => item.sourceId === sourceId))) {
			throw new Error('Every candidate target requires evidence.');
		}
	}
	for (const claim of [...analysis.domains, ...analysis.clusters, ...analysis.gaps, ...analysis.candidates, ...analysis.observations]) {
		assertEvidence(claim.evidence, input, reads);
	}
	return analysis;
}
