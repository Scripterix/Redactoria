import { hashJson, stableJson } from '../../core/serialization.ts';
import { FocusedMergeResultSchema, MergeProposalSchema } from './focused-merge.ts';
import type { FocusedMergeResult } from './focused-merge.ts';
import type { Evidence } from './contract.ts';

const safe = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/([\\`*_\[\]#|])/g, '\\$1');

export function createFocusedMergeArtifacts(raw: FocusedMergeResult): Record<string, string> {
	const result = FocusedMergeResultSchema.parse(raw);
	const lines = ['# Plan połączenia — ' + safe(result.proposedTitle), '',
		'Analiza redakcyjna dwóch pełnych tekstów. To plan, nie gotowy artykuł ani zgoda na publikację.', '',
		'## Rekomendacja', '',
		`- MERGE: ${result.recommended ? 'rekomendowany' : 'nierekomendowany'}; confidence ${result.confidence} (deklarowana pewność, nie prawdopodobieństwo).`,
		`- Uzasadnienie: ${safe(result.reason)}`,
		`- Tryb modelu: ${result.analysisContext.model.mode}; ${safe(result.analysisContext.model.model)}.`, '',
		'## Pliki przeanalizowane', ''];
	for (const target of result.targets) lines.push(`- ${safe(target.sourcePath)} (source\_id ${safe(target.sourceId)}): ${target.providedCharacters} znaków; pełny odczyt; SHA-256 ${target.contentHash}.`);
	function evidence(items: Evidence[]) {
		lines.push('');
		for (const item of items) lines.push(`    - Evidence: ${safe(item.sourceId)} | ${safe(item.sourcePath)} | ${item.field}: ${safe(item.value)}`);
	}
	lines.push('', '## Evidence rekomendacji', '');
	for (const item of result.evidence) lines.push(`- ${safe(item.sourceId)} | ${safe(item.sourcePath)} | ${item.field}: ${safe(item.value)}`);
	const sections = [
		['sharedTopics', 'Wspólne tematy'], ['uniqueToFirst', 'Unikalne dla części I'],
		['uniqueToSecond', 'Unikalne dla części II'], ['duplicates', 'Powtórzenia'], ['conflicts', 'Sprzeczności i niespójności'],
		['logicalOrder', 'Logika kolejności'], ['outdatedOrUncertain', 'Przestarzałe lub niepewne fragmenty'],
		['keep', 'Co zachować'], ['remove', 'Co usunąć lub zredukować'], ['needsResearch', 'Co wymaga researchu'],
	] as const;
	for (const [key, heading] of sections) {
		lines.push('', `## ${heading}`, '');
		if (!result[key].length) lines.push('Nie wskazano udokumentowanych przypadków w tych dwóch tekstach.');
		for (const item of result[key]) {
			lines.push(`- ${safe(item.interpretation)} (confidence ${item.confidence})`);
			evidence(item.evidence);
		}
	}
	lines.push('', '## Proponowana struktura artykułu', '', 'Tytuł roboczy: **' + safe(result.proposedTitle) + '**.', '');
	for (const section of result.proposedStructure) {
		lines.push(`${section.order}. ${safe(section.title)}`, '',
			`    - Cel: ${safe(section.purpose)}`,
			`    - Źródła: ${section.sourceIds.map(safe).join(', ')}; research przed redakcją: ${section.needsResearch ? 'tak' : 'nie'}.`);
		evidence(section.evidence);
	}
	lines.push('', '## Ograniczenia i decyzja człowieka', '');
	for (const limitation of result.limitations) lines.push(`- ${safe(limitation)}`);
	lines.push(`- Decyzja: ${result.recommended ? 'wyłącznie propozycja MERGE ze statusem proposed' : 'bez propozycji MERGE'}.`,
		'- SOURCE i CONTENT pozostają bez zmian. Nie uruchomiono Researchera ani Writera.',
		`- Hash requestu: ${result.analysisContext.requestHash}.`, '');
	const artifacts: Record<string, string> = {
		[`cartography/${result.artifactName}.json`]: stableJson(result),
		[`reports/${result.artifactName}.md`]: lines.join('\n'),
	};
	if (result.recommended) {
		const proposal = MergeProposalSchema.parse({ schemaVersion: 1, status: 'proposed', action: 'MERGE',
			targets: result.targets, confidence: result.confidence, reason: result.reason, evidence: result.evidence,
			analysisHash: hashJson(result), analysisRef: `lab/cartography/${result.artifactName}.json` });
		artifacts[`decisions/${result.artifactName}-proposal.json`] = stableJson(proposal);
	}
	return artifacts;
}
