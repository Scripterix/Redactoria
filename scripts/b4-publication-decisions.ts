import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AnyPublicationCandidateSchema, PublicationDecisionV3Schema } from '../engine/promotion/contract.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const date = '2026-10-12';
const note = 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.\n\n';

const definitions = {
	markdown: {
		slug: 'markdown-podstawy', topic: 'web',
		description: 'Praktyczne podstawy Markdown: nagłówki, wyróżnienia, linki, listy, bloki kodu oraz granica między CommonMark i GFM.',
		sources: [
			{ title: 'CommonMark Specification 0.31.2', url: 'https://spec.commonmark.org/0.31.2/', publisher: 'CommonMark' },
			{ title: 'GitHub Flavored Markdown Specification', url: 'https://github.github.com/gfm/', publisher: 'GitHub' },
		],
		origin: { source_id: '48', original_url: 'https://opengateweb.com/posts/2-jezyk-mark-down/', original_date: '2025-02-06', original_author: 'Scripterix' },
	},
	'javascript-calculator': {
		slug: 'kalkulator-w-javascript', topic: 'javascript',
		description: 'Prosty kalkulator w JavaScript z jawną walidacją liczb, obsługą operatorów oraz porównaniem funkcji i metody klasy.',
		sources: [
			{ title: 'ECMAScript Language Specification — Numbers and Dates', url: 'https://tc39.es/ecma262/multipage/numbers-and-dates.html', publisher: 'TC39' },
			{ title: 'ECMAScript Language Specification — Functions and Classes', url: 'https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html', publisher: 'TC39' },
			{ title: 'MDN — Number.isFinite()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite', publisher: 'MDN Web Docs' },
		],
		origin: { source_id: '281', original_url: 'https://opengateweb.com/posts/9-post-calc/', original_date: '2025-02-15', original_author: 'Scripterix' },
	},
	'api-http-json': {
		slug: 'api-http-json', topic: 'web',
		description: 'Wprowadzenie do API, metody GET, statusów HTTP, JSON i poprawnej obsługi błędów fetch na kontrolowanych przykładach.',
		sources: [
			{ title: 'WHATWG Fetch Standard', url: 'https://fetch.spec.whatwg.org/', publisher: 'WHATWG' },
			{ title: 'RFC 9110 — HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html', publisher: 'IETF' },
			{ title: 'RFC 8259 — The JavaScript Object Notation Data Interchange Format', url: 'https://www.rfc-editor.org/rfc/rfc8259.html', publisher: 'IETF' },
			{ title: 'MDN — Window.fetch()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch', publisher: 'MDN Web Docs' },
		],
		origin: { source_id: '578', original_url: 'https://opengateweb.com/posts/22-post-api/', original_date: '2025-03-07', original_author: 'Scripterix' },
	},
} as const;

for (const [topic, definition] of Object.entries(definitions)) {
	const candidateRef = `lab/candidates/${topic}/article.json`;
	const candidateText = await readFile(resolve(project, candidateRef), 'utf8');
	const candidate = AnyPublicationCandidateSchema.parse(JSON.parse(candidateText));
	if (candidate.schemaVersion !== 3 || candidate.topic !== topic) throw new Error(`Unexpected candidate for ${topic}.`);
	const decision = {
		schemaVersion: 3, status: 'approved', approvedBy: 'human', scope: 'public-production', approvedAt: new Date().toISOString(),
		authorization: 'Explicit B4 CONTINUE authorization: publish Markdown, JavaScript Calculator and API / HTTP / JSON after exact Critic PASS, candidate integrity and verify PASS; commit, push master and verify Cloudflare after the complete gate.',
		candidateRef, candidateHash: hashBytes(candidateText), articleHash: candidate.articleHash,
		criticReviewRef: candidate.criticReviewRef, criticReviewHash: candidate.criticReviewHash,
		destination: `content/articles/${definition.slug}.md`,
		metadata: {
			title: candidate.title, description: definition.description, slug: definition.slug, status: 'published', created: date, updated: date,
			domain: 'programming', topic: definition.topic, author: { type: 'ai-assisted', name: 'Scripterix' }, sources: definition.sources,
			origin: { type: 'wordpress-export', ...definition.origin },
			review: { status: 'approved', reviewer: 'human — B4 publication authorization', confidence: 1 },
			automation: { generated: true, last_checked: date, update_priority: 'normal' },
			redactoria: { decision: 'rewrite', modernization: 'major' },
		},
		presentationCleanup: { removeExact: [note] }, remotePublicationApproved: true,
	};
	PublicationDecisionV3Schema.parse(decision);
	await writeLabArtifacts(project, sourceRoot, { [`decisions/${topic}-publication.json`]: stableJson(decision) });
}

console.log('Created three exact B4 human-authorized publication decisions.');
