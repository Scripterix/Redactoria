import { z } from 'zod';

export const RESEARCHER_POLICY = Object.freeze({
	may: ['read_source', 'read_approved_decision', 'read_lab_context', 'read_external_documentation', 'produce_research_packet', 'write_research_lab'],
	mustNot: ['write_source', 'write_content', 'publish', 'approve', 'delete', 'merge_files', 'invoke_other_agent'],
});
export const DEFAULT_RESEARCH_LIMITS = Object.freeze({
	maxBodyCharacters: 40000, maxSourceBytes: 1048576, maxDocuments: 40,
	allowedDocumentHosts: ['www.php.net', 'php.net', 'developer.mozilla.org', 'tc39.es', 'dom.spec.whatwg.org'],
});
export const ResearchLimitsSchema = z.strictObject({
	maxBodyCharacters: z.number().int().min(1).max(100000), maxSourceBytes: z.number().int().min(1).max(10485760),
	maxDocuments: z.number().int().min(1).max(100), allowedDocumentHosts: z.array(z.string().min(1)).min(1),
});

export function assertDocumentUrl(raw: string, allowedHosts: string[]) {
	const url = new URL(raw);
	if (url.protocol !== 'https:' || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)) {
		throw new Error('Unsupported documentation source URL.');
	}
}
