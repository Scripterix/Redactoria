import type { Inventory } from '../../../scripts/legacy/types.ts';
import { stableJson } from '../../core/serialization.ts';
import { CartographerResultSchema } from './contract.ts';
import type { CartographerResult, EditorialCandidate, Evidence } from './contract.ts';

const rank = { high: 0, medium: 1, low: 2 };
const safe = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/([\\`*_\[\]#|])/g, '\\$1');

export function rankCandidates(candidates: EditorialCandidate[]) {
	return [...candidates].sort((a, b) => rank[a.priority] - rank[b.priority] || b.confidence - a.confidence || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function createCartographerReport(result: CartographerResult, inventory: Inventory): string {
	const lines = ['# Cartographer 0.1 — pierwszy przebieg', '',
		'Propozycje do ludzkiego review; żadne z opisanych działań nie zostało wykonane.', '',
		'## CORPUS OVERVIEW', '',
		`- Artykuły: ${result.corpusOverview.articleCount}; OK: ${result.corpusOverview.parsedOk}; metadane do review: ${result.corpusOverview.reviewRequired}; błędy: ${result.corpusOverview.parseErrors}.`,
		`- Materiały przypisane do mapy: ${result.corpusOverview.mappedArticleCount}; nieprzypisane: ${result.corpusOverview.unmappedArticleIds.length}.`,
		`- Głębokie odczyty: ${result.analysisContext.deepReads.length}/${result.analysisContext.limits.maxDeepReads}.`,
		`- Model: ${safe(result.analysisContext.model.model)}; adapter: ${safe(result.analysisContext.model.adapter)}; tryb: ${result.analysisContext.model.mode}.`,
		`- Hash inventory: ${result.analysisContext.inventoryHash}.`, '',
		'Confidence to deklarowana pewność interpretacji, nie skalibrowane prawdopodobieństwo.', ''];
	function evidence(items: Evidence[]) {
		lines.push('');
		for (const item of items) lines.push(`    - Dowód: ${safe(item.sourceId)} | ${safe(item.sourcePath)} | ${item.field}: ${safe(item.value)}`);
	}
	function opportunity(candidate: EditorialCandidate, index?: number) {
		const target = candidate.target.proposedTitle ?? candidate.target.sourceIds.map((id) => {
			const article = inventory.articles.find((article) => article.source_id === id);
			return `${id}: ${article?.title ?? '(brak tytułu)'}`;
		}).join('; ');
		lines.push(`${index === undefined ? '-' : `${index + 1}.`} ${candidate.action} — ${safe(target)} (${candidate.priority}, confidence ${candidate.confidence})`,
			'', `    - Interpretacja: ${safe(candidate.reason)}`);
		evidence(candidate.evidence);
	}
	lines.push('## MAJOR KNOWLEDGE DOMAINS', '');
	const domains = new Map(result.domains.map((domain) => [domain.id, domain]));
	function domainTree(parent: string | null, depth: number) {
		for (const domain of result.domains.filter((domain) => domain.parentId === parent)) {
			lines.push(`${'  '.repeat(depth)}- ${safe(domain.name)} — ${domain.articleIds.length} materiałów; confidence ${domain.confidence}.`);
			domainTree(domain.id, depth + 1);
		}
	}
	domainTree(null, 0);
	lines.push('', '### Uzasadnienia domen', '');
	for (const domain of result.domains) {
		lines.push(`- ${safe(domain.name)}: ${safe(domain.interpretation)}`);
		evidence(domain.evidence);
	}
	lines.push('', '## TOPIC CLUSTERS', '');
	for (const cluster of result.clusters) {
		lines.push(`- ${safe(cluster.name)} (${safe(domains.get(cluster.domainId)!.name)}): ${cluster.articleIds.length} materiałów; coverage ${cluster.coverage}; confidence ${cluster.confidence}.`,
			'', `    - Interpretacja: ${safe(cluster.interpretation)}`,
			`    - source_ids: ${cluster.articleIds.map(safe).join(', ')}.`);
		evidence(cluster.evidence);
	}
	for (const [heading, coverages] of [['STRONG COVERAGE', ['strong']], ['WEAK COVERAGE', ['weak', 'partial', 'unknown']]] as const) {
		lines.push('', `## ${heading}`, '');
		const matching = result.clusters.filter((cluster) => (coverages as readonly string[]).includes(cluster.coverage));
		if (!matching.length) lines.push('Brak klastrów z takim oznaczeniem.');
		for (const cluster of matching) lines.push(`- ${safe(cluster.name)}: ${safe(cluster.interpretation)}`);
	}
	lines.push('', '## KNOWLEDGE GAPS', '');
	if (!result.gaps.length) lines.push('Brak uzasadnionych propozycji luk.');
	for (const gap of result.gaps) {
		lines.push(`- ${safe(gap.description)} (${gap.priority}, confidence ${gap.confidence})`, '', `    - Interpretacja / uzasadnienie: ${safe(gap.reason)}`);
		evidence(gap.evidence);
	}
	for (const [heading, actions] of [['POSSIBLE DUPLICATE / MERGE CANDIDATES', ['MERGE']], ['OUTDATED / REVIEW CANDIDATES', ['UPDATE', 'REVIEW', 'ARCHIVE']]] as const) {
		lines.push('', `## ${heading}`, '');
		const matching = rankCandidates(result.candidates).filter((candidate) => (actions as readonly string[]).includes(candidate.action));
		if (!matching.length) lines.push('Brak uzasadnionych propozycji.');
		matching.forEach((candidate) => opportunity(candidate));
	}
	lines.push('', '## TOP 10 EDITORIAL OPPORTUNITIES', '');
	rankCandidates(result.candidates).slice(0, 10).forEach((candidate, index) => opportunity(candidate, index));
	lines.push('', '## UNCERTAINTIES', '');
	for (const uncertainty of result.uncertainties) lines.push(`- ${safe(uncertainty)}`);
	for (const observation of result.observations) {
		lines.push(`- ${safe(observation.interpretation)} (confidence ${observation.confidence})`);
		evidence(observation.evidence);
	}
	lines.push('', '## LIMITATIONS', '');
	for (const limitation of result.limitations) lines.push(`- ${safe(limitation)}`);
	lines.push('- Cytaty i metadane są weryfikowane automatycznie; trafność interpretacji wymaga ludzkiego review.',
		'- Brak przeglądu internetu, Search Console i weryfikacji aktualności frameworków.',
		'- Brak automatycznego zapisu do CONTENT, publikacji lub wywołania innego agenta.', '');
	for (const read of result.analysisContext.deepReads) lines.push(`- Odczyt ${safe(read.sourceId)} | ${safe(read.sourcePath)}: ${read.providedCharacters} znaków; truncated=${read.truncated}; SHA-256 ${read.contentHash}.`);
	lines.push('', '## TOP 5 NEXT ACTIONS', '', 'Tylko rekomendacje — wymagają decyzji człowieka.', '');
	rankCandidates(result.candidates).slice(0, 5).forEach((candidate, index) => opportunity(candidate, index));
	return lines.join('\n') + '\n';
}

export function createCartographerArtifacts(raw: CartographerResult, inventory: Inventory): Record<string, string> {
	const result = CartographerResultSchema.parse(raw);
	return {
		'cartography/knowledge-map.json': stableJson(result),
		'cartography/editorial-candidates.json': stableJson({ schemaVersion: 1, inventoryHash: result.analysisContext.inventoryHash,
			model: result.analysisContext.model, candidates: result.candidates }),
		'reports/cartographer-001.md': createCartographerReport(result, inventory),
	};
}
