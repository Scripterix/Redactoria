import { z } from 'zod';

export const RESEARCHER_POLICY = Object.freeze({
	may: ['read_source', 'read_approved_decision', 'read_lab_context', 'read_external_documentation', 'produce_research_packet', 'write_research_lab'],
	mustNot: ['write_source', 'write_content', 'publish', 'approve', 'delete', 'merge_files', 'invoke_other_agent'],
});

export const SourceAuthorityTierSchema = z.union([
	z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7),
]);
export const SourceAuthorityClassSchema = z.enum([
	'specification-standard', 'official-project-runtime', 'mdn', 'implementation-platform',
	'compatibility-support', 'educational', 'real-world-problem',
]);
export const SourceEvidenceRoleSchema = z.enum([
	'technical-authority', 'practical-reference', 'implementation-detail',
	'compatibility-evidence', 'educational-clarity', 'problem-signal',
]);
export type SourceAuthorityTier = z.infer<typeof SourceAuthorityTierSchema>;
export type SourceAuthorityClass = z.infer<typeof SourceAuthorityClassSchema>;
export type SourceEvidenceRole = z.infer<typeof SourceEvidenceRoleSchema>;

type AuthorityProfile = Readonly<{
	tier: SourceAuthorityTier;
	authorityClass: SourceAuthorityClass;
	evidenceRole: SourceEvidenceRole;
}>;

const authorityProfiles = [
	{ tier: 1, authorityClass: 'specification-standard', evidenceRole: 'technical-authority', hosts: [
		'tc39.es', 'whatwg.org', 'html.spec.whatwg.org', 'dom.spec.whatwg.org', 'fetch.spec.whatwg.org',
		'url.spec.whatwg.org', 'infra.spec.whatwg.org', 'streams.spec.whatwg.org', 'encoding.spec.whatwg.org',
		'xhr.spec.whatwg.org', 'websockets.spec.whatwg.org', 'storage.spec.whatwg.org', 'console.spec.whatwg.org',
		'mimesniff.spec.whatwg.org', 'notifications.spec.whatwg.org', 'w3.org', 'www.w3.org',
		'datatracker.ietf.org', 'rfc-editor.org', 'www.rfc-editor.org', 'spec.commonmark.org',
	] },
	{ tier: 2, authorityClass: 'official-project-runtime', evidenceRole: 'technical-authority', hosts: [
		'nodejs.org', 'typescriptlang.org', 'www.typescriptlang.org', 'docs.python.org', 'git-scm.com',
		'www.git-scm.com', 'curl.se', 'docs.github.com', 'github.github.com', 'php.net', 'www.php.net',
	] },
	{ tier: 3, authorityClass: 'mdn', evidenceRole: 'practical-reference', hosts: ['developer.mozilla.org'] },
	{ tier: 4, authorityClass: 'implementation-platform', evidenceRole: 'implementation-detail', hosts: [
		'web.dev', 'developer.chrome.com', 'v8.dev',
	] },
	{ tier: 5, authorityClass: 'compatibility-support', evidenceRole: 'compatibility-evidence', hosts: ['caniuse.com'] },
	{ tier: 6, authorityClass: 'educational', evidenceRole: 'educational-clarity', hosts: [
		'javascript.info', 'commonmark.org', 'www.commonmark.org',
	] },
	{ tier: 7, authorityClass: 'real-world-problem', evidenceRole: 'problem-signal', hosts: ['stackoverflow.com'] },
] as const;

export const SOURCE_AUTHORITY_HOSTS = Object.freeze(authorityProfiles.flatMap(profile => [...profile.hosts]));

export function sourceAuthorityForUrl(raw: string): AuthorityProfile {
	const hostname = new URL(raw).hostname.toLowerCase();
	const profile = authorityProfiles.find(item => item.hosts.includes(hostname as never));
	if (!profile) throw new Error('Documentation source is not classified in the Source Authority Ladder.');
	return { tier: profile.tier, authorityClass: profile.authorityClass, evidenceRole: profile.evidenceRole };
}

export const DEFAULT_RESEARCH_LIMITS = Object.freeze({
	maxBodyCharacters: 40000, maxSourceBytes: 1048576, maxDocuments: 40,
	allowedDocumentHosts: SOURCE_AUTHORITY_HOSTS,
});
export const ResearchLimitsSchema = z.strictObject({
	maxBodyCharacters: z.number().int().min(1).max(100000), maxSourceBytes: z.number().int().min(1).max(10485760),
	maxDocuments: z.number().int().min(1).max(100), allowedDocumentHosts: z.array(z.string().min(1)).min(1),
});

export function assertDocumentUrl(raw: string, allowedHosts: string[]) {
	const url = new URL(raw);
	if (url.protocol !== 'https:' || url.username || url.password || url.port || !allowedHosts.includes(url.hostname.toLowerCase())) {
		throw new Error('Unsupported documentation source URL.');
	}
}
