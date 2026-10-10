import { stableJson } from '../../core/serialization.ts';
import { ResearchPacketSchema } from './contract.ts';
import type { Finding, ResearchBundle, ResearchPacket } from './contract.ts';
import { findings } from './validation.ts';

export function researchReport(packet: ResearchPacket, questions: ResearchBundle['questions']) {
	const all = findings(packet);
	const lines = [`# Researcher 0.1 — ${packet.topic}`, '', '## RESEARCH SCOPE', '',
		(packet.targets.length === 2 ? 'Research Packet, nie artykuł ani zatwierdzenie publikacji. Dokładnie dwa pełne materiały SOURCE.' : 'Research Packet, nie artykuł ani zatwierdzenie publikacji. Jeden pełny materiał SOURCE.'), '',
		...packet.targets.map(target => `- ${target.sourcePath} (${target.sourceId})`), '',
		`Tryb: ${packet.analysisContext.model.mode}; model: ${packet.analysisContext.model.model}.`,
		`Request SHA-256: ${packet.analysisContext.requestHash}`, '',
		'## PHP VERSION TARGET', '', packet.environment.phpVersionScope, '', `Stan dokumentacji: ${packet.environment.asOfDate}.`, '',
		...(packet.targets.length === 2 ? packet.analysisContext.probes.slice(0, 1).map(probe => `Próby wykonano lokalnie na PHP ${probe.phpVersion}; nie oznacza to uruchomienia na docelowych wersjach.`) : [`Wykonane runtime: ${[...new Set(packet.analysisContext.probes.map(probe => probe.phpVersion))].join(', ')}; szczegóły w osobnym execution evidence.`]), ''];
	function render(items: readonly Finding[]) {
		if (!items.length) { lines.push('Brak.', ''); return; }
		for (const item of items) {
			const citations = item.evidence.map(evidence => {
				const source = packet.sourceRegister.find(source => source.id === evidence.documentId)!;
				return `[${source.id}/${evidence.excerptId}](${source.url})`;
			});
			lines.push(`### ${item.id}`, '', `${item.claim} (${item.status}; confidence: ${item.confidence})`, '',
			`Evidence: ${citations.join(', ') || 'Niepotwierdzone dokumentacją — needs-review.'}`, '',
			...item.articleEvidence.map(evidence => `SOURCE: ${evidence.sourcePath}, ${evidence.field}: ${JSON.stringify(evidence.value)}`), '',
			`Zalecenie: ${item.recommendation}`, '');
			const code = packet.codeReview.find(code => code.id === item.id);
			if (code) lines.push(`Kod: ${code.verification}; probes: ${code.probeIds.join(', ') || 'brak uruchomienia'}.`, '');
		}
	}
	for (const [heading, items] of [
		['VERIFIED CLAIMS', packet.verifiedFacts],
		['CLAIMS REQUIRING CORRECTION', packet.incorrectClaims],
		['OUTDATED / QUESTIONABLE MATERIAL', [...packet.outdatedClaims, ...packet.ambiguousClaims]],
		['CODE ISSUES', packet.codeReview],
	] as const) { lines.push(`## ${heading}`, ''); render(items); }
	for (const section of packet.targets.length === 2 ? ['ARRAY KEY BEHAVIOR', 'NULL / MISSING KEY BEHAVIOR', 'ARRAY OPERATIONS', 'SORTING', 'MAP / FILTER / REDUCE', 'EXTRACT SAFETY', 'FORM EXAMPLES'] : [...new Set(questions.map(question => question.section))]) {
		lines.push(`## ${section}`, '');
		const ids = new Set(questions.filter(question => question.section === section).map(question => question.id));
		// Cross-reference rather than duplicating the full claim and source quotes.
		for (const item of all.filter(item => item.questionIds.some(id => ids.has(id)))) lines.push(`- [${item.id}](#${item.id}): ${item.recommendation}`);
		lines.push('');
	}
	lines.push('## SECURITY / CAUTION NOTES', ''); render(packet.securityNotes);
	lines.push('## RECOMMENDED ARTICLE CHANGES', '', ...packet.recommendations.map(item =>
		`- ${item.action}: ${item.instruction} [${item.findingIds.join(', ')}]`), '',
		'## UNRESOLVED QUESTIONS', '', ...packet.unresolvedQuestions.map(item => `- ${item.questionId}: ${item.reason} (needs-review)`), '',
		'## SOURCE REGISTER', '', ...packet.sourceRegister.map(source =>
		`- [${source.id} — ${source.title}](${source.url}); ${source.kind}; pobrano ${source.retrievedAt}; evidence: ${source.evidenceIds.join(', ')}; SHA-256: ${source.documentHash}`), '',
		'## LIMITATIONS', '', ...packet.limitations.map(item => `- ${item}`), '',
		'## WRITER HANDOFF', '', `Założona wersja: ${packet.environment.phpVersionScope}`, '');
	for (const [name, items] of [['Zachowaj', packet.writerHandoff.keep], ['Popraw', packet.writerHandoff.correct],
		['Nie powielaj', packet.writerHandoff.avoid], ['Ostrożność', packet.writerHandoff.caution]] as const) {
		lines.push(`### ${name}`, '', ...items.map(item => `- ${item.instruction} [${item.findingIds.join(', ')}]`), '');
	}
	lines.push('### Zweryfikowane przykłady', '', ...packet.writerHandoff.verifiedCodeFindingIds.map(id => {
		const code = packet.codeReview.find(item => item.id === id)!;
		return `- ${id}: ${code.verification}; ${code.probeIds.join(', ') || 'review dokumentacji, bez wykonania'}`;
	}), '', 'STOP — następny krok wymaga decyzji człowieka.');
	return lines.join('\n') + '\n';
}

export function createResearchArtifacts(raw: ResearchPacket, questions: ResearchBundle['questions']) {
	const packet = ResearchPacketSchema.parse(raw);
	const slug = packet.analysisContext.topicSlug;
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Unsafe research artifact slug.');
	return { [`research/${slug}/research.json`]: stableJson(packet), [`research/${slug}/research.md`]: researchReport(packet, questions) };
}
