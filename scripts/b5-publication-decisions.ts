import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AnyPublicationCandidateSchema, PublicationDecisionV3Schema } from '../engine/promotion/contract.ts';
import { hashBytes } from '../engine/core/editorial-context.ts';
import { stableJson } from '../engine/core/serialization.ts';
import { writeLabArtifacts } from '../engine/core/lab-writer.ts';

const project = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(project, '../temp-ogwo/posts');
const date = '2026-10-14';
const note = 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie ograniczonej zgody oraz rzeczywiste wykonania właściwe dla wskazanego runtime. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.\n\n';

const definitions = {
	'git-local-basics': {
		slug: 'git-lokalnie', topic: 'web',
		description: 'Praktyczne podstawy lokalnego Git: working tree, staging, status, diff, commit i krótka historia zmian.',
		sources: [
			{ title: 'git-init Documentation', url: 'https://git-scm.com/docs/git-init', publisher: 'Git' },
			{ title: 'git-status Documentation', url: 'https://git-scm.com/docs/git-status', publisher: 'Git' },
			{ title: 'git-add Documentation', url: 'https://git-scm.com/docs/git-add', publisher: 'Git' },
			{ title: 'git-diff Documentation', url: 'https://git-scm.com/docs/git-diff', publisher: 'Git' },
			{ title: 'git-commit Documentation', url: 'https://git-scm.com/docs/git-commit', publisher: 'Git' },
			{ title: 'git-log Documentation', url: 'https://git-scm.com/docs/git-log', publisher: 'Git' },
		],
		origin: { source_id: '277', original_url: 'https://opengateweb.com/posts/8-post-gist/', original_date: '2025-02-13', original_author: 'Scripterix' },
	},
	'curl-http-basics': {
		slug: 'curl-http', topic: 'web',
		description: 'Podstawy curl i HTTP: odczytywanie odpowiedzi, nagłówków, statusów oraz lokalnego dokumentu JSON.',
		sources: [
			{ title: 'curl command line tool man page', url: 'https://curl.se/docs/manpage.html', publisher: 'curl' },
			{ title: 'RFC 9110 — HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html', publisher: 'IETF' },
		],
		origin: { source_id: '1336', original_url: 'https://opengateweb.com/posts/post-64-curl-twoje-terminalowe-okno-na-swiat/', original_date: '2025-07-18', original_author: 'Scripterix' },
	},
	'python-fundamentals': {
		slug: 'podstawy-pythona', topic: 'python',
		description: 'Pierwsze kroki w Pythonie: wartości, zmienne, warunki, pętle i proste funkcje na wykonywalnych przykładach.',
		sources: [
			{ title: 'Python 3.14 Tutorial — An Informal Introduction', url: 'https://docs.python.org/3.14/tutorial/introduction.html', publisher: 'Python Software Foundation' },
			{ title: 'Python 3.14 Tutorial — More Control Flow Tools', url: 'https://docs.python.org/3.14/tutorial/controlflow.html', publisher: 'Python Software Foundation' },
		],
		origin: { source_id: '283', original_url: 'https://opengateweb.com/posts/10-post-python/', original_date: '2025-02-17', original_author: 'Scripterix' },
	},
} as const;

for (const [topic, definition] of Object.entries(definitions)) {
	const candidateRef = `lab/candidates/${topic}/article.json`;
	const candidateText = await readFile(resolve(project, candidateRef), 'utf8');
	const candidate = AnyPublicationCandidateSchema.parse(JSON.parse(candidateText));
	if (candidate.schemaVersion !== 3 || candidate.topic !== topic) throw new Error(`Unexpected candidate for ${topic}.`);
	const decision = {
		schemaVersion: 3, status: 'approved', approvedBy: 'human', scope: 'public-production', approvedAt: new Date().toISOString(),
		authorization: 'Explicit B5 publication authorization: publish exactly the reviewed Git local, curl / HTTP and Python candidates sequentially; verify each lifecycle, then commit, push master and verify the final Cloudflare production deployment.',
		candidateRef, candidateHash: hashBytes(candidateText), articleHash: candidate.articleHash,
		criticReviewRef: candidate.criticReviewRef, criticReviewHash: candidate.criticReviewHash,
		destination: `content/articles/${definition.slug}.md`,
		metadata: {
			title: candidate.title, description: definition.description, slug: definition.slug, status: 'published', created: date, updated: date,
			domain: 'programming', topic: definition.topic, author: { type: 'ai-assisted', name: 'Scripterix' }, sources: definition.sources,
			origin: { type: 'wordpress-export', ...definition.origin },
			review: { status: 'approved', reviewer: 'human — B5 publication authorization', confidence: 1 },
			automation: { generated: true, last_checked: date, update_priority: 'normal' },
			redactoria: { decision: 'rewrite', modernization: 'major' },
		},
		presentationCleanup: { removeExact: [note] }, remotePublicationApproved: true,
	};
	PublicationDecisionV3Schema.parse(decision);
	await writeLabArtifacts(project, sourceRoot, { [`decisions/${topic}-publication.json`]: stableJson(decision) });
}

console.log('Created three exact B5 human-authorized publication decisions.');
