import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';
import { promote, renderPromotedArticle } from '../../engine/promotion/gate.ts';
import { parsePromotionArguments, PublicationDecisionSchema } from '../../engine/promotion/contract.ts';
import { hashBytes } from '../../engine/core/editorial-context.ts';
import { stableJson } from '../../engine/core/serialization.ts';
import { inputFixture, textFile, jsonFile } from '../fixtures/editorial.ts';
import { loadEditorialInput } from '../../scripts/editorial-input.ts';

const candidateRef = 'lab/candidates/php-arrays/article.json';
const decisionRef = 'lab/decisions/php-arrays-publication.json';
const destination = 'content/articles/tablice-w-php.md';
const temporary: string[] = [];
afterEach(async () => { for (const path of temporary.splice(0)) await rm(path, { recursive: true, force: true }); });

async function fixture() {
 const project = await mkdtemp(join(tmpdir(), 'redactoria-promotion-')); temporary.push(project);
 const editorial = inputFixture(), candidate = jsonFile(candidateRef);
 const files = new Map(editorial.artifacts.map(item => [item.path, item.contents]));
 for (const path of [candidateRef, candidateRef.replace('.json', '.md'), decisionRef,
  candidate.draftRef, candidate.draftMetadataRef, candidate.criticReviewRef, candidate.revisionRef,
  'lab/drafts/php-arrays/code-execution.json', 'content/topics/php.yaml']) files.set(path, textFile(path));
 files.set('source/sentinel.md', 'read-only source');
 for (const [path, contents] of files) {
  await mkdir(dirname(join(project, path)), { recursive: true }); await writeFile(join(project, path), contents);
 }
 await mkdir(join(project, 'content/articles'), { recursive: true });
 await mkdir(join(project, 'lab/reports'), { recursive: true });
 const options = { project, candidate: candidateRef, decision: decisionRef, loadEditorial: async () => editorial };
 async function update(path: string, change: (raw: any) => void) {
  const raw = JSON.parse(await readFile(join(project, path), 'utf8')); change(raw);
  await writeFile(join(project, path), stableJson(raw));
 }
 async function reject() {
  const protectedPaths = ['source/sentinel.md', candidateRef.replace('.json', '.md')];
  const before = await Promise.all(protectedPaths.map(path => readFile(join(project, path), 'utf8')));
  await expect(promote(options)).rejects.toThrow();
  expect(await readdir(join(project, 'content/articles'))).toEqual([]);
  expect(await readdir(join(project, 'lab/reports'))).toEqual([]);
  for (const [index, path] of protectedPaths.entries()) expect(await readFile(join(project, path), 'utf8')).toBe(before[index]);
 }
 return { project, options, files, update, reject, editorial };
}

describe('Promotion Gate — offline, human-approved and local only', () => {
 it('promotes the exact reviewed body, valid metadata and full audit without changing upstream', async () => {
  const f = await fixture(), record = await promote(f.options);
  const output = await readFile(join(f.project, destination), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(output)!;
  expect(match[2]).toBe(textFile(candidateRef.replace('.json', '.md')));
  expect(hashBytes(match[2]!)).toBe(record.articleHash);
  expect(parse(match[1]!)).toMatchObject({ slug: 'tablice-w-php', topic: 'php', status: 'published', review: {status: 'approved'} });
  expect(record).toMatchObject({result: 'PROMOTED_LOCAL', remotePublicationApproved: false, decisionRef,
   criticReviewRef: 'lab/reviews/php-arrays/critic-review.json', researchApprovalRef: 'lab/decisions/php-arrays-research-approval.json'});
  expect(JSON.parse(await readFile(join(f.project, 'lab/reports/tablice-w-php-promotion.json'), 'utf8'))).toEqual(record);
  for (const [path, contents] of f.files) expect(await readFile(join(f.project, path), 'utf8')).toBe(contents);
 });
 it('does not hardcode PHP Arrays identity or its destination in the gate', async () => {
  const f = await fixture();
  await f.update(decisionRef, raw => { raw.metadata.slug = 'lekcja-tablic'; raw.destination = 'content/articles/lekcja-tablic.md'; });
  expect((await promote(f.options)).destination).toBe('content/articles/lekcja-tablic.md');
 });
 it('refuses a second promotion and preserves the existing article and audit', async () => {
  const f = await fixture(); await promote(f.options);
  const before = await readFile(join(f.project, destination), 'utf8');
  await expect(promote(f.options)).rejects.toThrow(/collision/);
  expect(await readFile(join(f.project, destination), 'utf8')).toBe(before);
 });
 it.each([
  ['status', 'proposed'], ['approvedBy', 'agent'], ['scope', 'production'],
  ['remotePublicationApproved', true], ['candidateHash', '0'.repeat(64)],
  ['articleHash', '0'.repeat(64)], ['criticReviewHash', '0'.repeat(64)],
  ['destination', 'source/article.md'], ['destination', 'content/articles/../article.md'],
 ])('rejects invalid decision %s = %s with no CONTENT write', async (key, value) => {
  const f = await fixture(); await f.update(decisionRef, raw => { raw[key] = value; }); await f.reject();
 });
 it.each([
  ['status', 'draft'], ['criticVerdict', 'REVISE'], ['criticVerdict', 'BLOCK'],
  ['published', true], ['approvedForPublication', true], ['articleHash', '0'.repeat(64)],
  ['criticReviewHash', '0'.repeat(64)], ['revisionHash', '0'.repeat(64)],
 ])('rejects invalid candidate %s = %s', async (key, value) => {
  const f = await fixture(); await f.update(candidateRef, raw => { raw[key] = value; });
  const changedHash = hashBytes(await readFile(join(f.project, candidateRef), 'utf8'));
  await f.update(decisionRef, raw => { raw.candidateHash = changedHash; });
  await f.reject();
 });
 it.each(['lab/candidates/php-arrays/article.md', 'lab/drafts/php-arrays/article.json',
  'lab/reviews/php-arrays/critic-review.json', 'lab/drafts/php-arrays/revision.json',
  'lab/drafts/php-arrays/code-execution.json'])('rejects changed evidence %s', async path => {
  const f = await fixture(); await writeFile(join(f.project, path), 'changed'); await f.reject();
 });
 it.each(['status', 'approvedBy'])('rejects revoked MERGE %s', async key => {
  const f = await fixture(); await f.update(f.editorial.config.sourceDecision, raw => { raw[key] = 'revoked'; }); await f.reject();
 });
 it('rejects missing Research approval', async () => {
  const f = await fixture(); await rm(join(f.project, f.editorial.config.researchApproval)); await f.reject();
 });
 it('rejects revoked Research approval', async () => {
  const f = await fixture(); await f.update(f.editorial.config.researchApproval, raw => { raw.status = 'revoked'; }); await f.reject();
 });
 it('rejects missing candidate', async () => {
  const f = await fixture(); await rm(join(f.project, candidateRef)); await f.reject();
 });
 it.each([
  ['status', 'draft'], ['slug', '../escape'], ['topic', 'missing-topic'], ['created', 'not-a-date'],
  ['title', 'Unreviewed title'], ['review', {status: 'pending'}],
 ])('rejects incompatible metadata %s', async (key, value) => {
  const f = await fixture(); await f.update(decisionRef, raw => { raw.metadata[key] = value; }); await f.reject();
 });
 it('detects slug collisions regardless of filename and status', async () => {
  const f = await fixture();
  const metadata = jsonFile(decisionRef).metadata;
  await writeFile(join(f.project, 'content/articles/different-name.md'), renderPromotedArticle({...metadata, status: 'draft'}, 'existing body'));
  await expect(promote(f.options)).rejects.toThrow(/collision/);
  expect(await readdir(join(f.project, 'content/articles'))).toEqual(['different-name.md']);
 });
 it('rejects a CONTENT junction pointing at SOURCE', async () => {
  const f = await fixture(); await rm(join(f.project, 'content/articles'), {recursive: true});
  await symlink(join(f.project, 'source'), join(f.project, 'content/articles'), 'junction');
  await expect(promote(f.options)).rejects.toThrow(/symlinks\/junctions/);
  expect(await readdir(join(f.project, 'source'))).toEqual(['sentinel.md']);
 });
 it('rejects existing audit before touching CONTENT', async () => {
  const f = await fixture(); await writeFile(join(f.project, 'lab/reports/tablice-w-php-promotion.json'), 'existing');
  await expect(promote(f.options)).rejects.toThrow(/overwrite/);
  expect(await readdir(join(f.project, 'content/articles'))).toEqual([]);
 });
 it('renders the same validated metadata/body byte-for-byte deterministically', () => {
  const metadata = jsonFile(decisionRef).metadata, body = textFile(candidateRef.replace('.json', '.md'));
  expect(renderPromotedArticle(metadata, body)).toBe(renderPromotedArticle(metadata, body));
  expect(PublicationDecisionSchema.parse(jsonFile(decisionRef)).scope).toBe('local-publication-test');
 });
});

describe('Promotion Gate — schema 2 public-production', () => {
 it('promotes the exact B2 candidate and removes only its explicitly approved LAB note', async () => {
  const project = await mkdtemp(join(tmpdir(), 'redactoria-public-promotion-')); temporary.push(project);
  const candidate = JSON.parse(await readFile(join(process.cwd(), 'lab/candidates/php-control-flow/article.json'), 'utf8'));
  const editorial = await loadEditorialInput('php-control-flow');
  const candidatePath = 'lab/candidates/php-control-flow/article.json';
  const decisionPath = 'lab/decisions/php-control-flow-publication.json';
  const paths = new Set([
   ...editorial.artifacts.map(item => item.path), candidatePath, candidatePath.replace('.json', '.md'),
   decisionPath, candidate.draftRef, candidate.draftMetadataRef, candidate.criticReviewRef,
   candidate.revisionRef, 'lab/drafts/php-control-flow/code-execution.json', 'content/topics/php.yaml',
  ]);
  for (const path of paths) {
   await mkdir(dirname(join(project, path)), { recursive: true });
   await writeFile(join(project, path), await readFile(join(process.cwd(), path)));
  }
  await mkdir(join(project, 'content/articles'), { recursive: true });
  await mkdir(join(project, 'lab/reports'), { recursive: true });
  const record = await promote({ project, candidate: candidatePath, decision: decisionPath, loadEditorial: async () => editorial });
  const content = await readFile(join(project, 'content/articles/instrukcje-sterujace-php.md'), 'utf8');
  const body = content.replace(/^---\r?\n[^]*?\r?\n---\r?\n/, '');
  const source = await readFile(join(process.cwd(), candidatePath.replace('.json', '.md')), 'utf8');
  const note = 'Nota redakcyjna: draft w LAB, nie publikacja. Podstawa: zwalidowany Research Packet w zakresie zgody B2 oraz rzeczywiste wykonania PHP 8.4 i 8.5. Mapa evidence, provenance i przyszłe interakcje znajdują się w article.json.\n\n';
  expect(body).toBe(source.replace(note, ''));
  expect(record).toMatchObject({ schemaVersion: 2, result: 'PROMOTED_PUBLIC', scope: 'public-production',
   remotePublicationApproved: true, sourceDecisionRef: 'lab/decisions/php-control-flow-rewrite.json' });
  expect(record.transforms).toEqual(['Content Collection YAML front matter', 'Removed exact human-approved technical LAB/draft note']);
 });
});

describe('Promotion CLI arguments', () => {
 it('accepts only explicit candidate + decision', () => expect(parsePromotionArguments(['--decision', decisionRef, '--candidate', candidateRef])).toEqual({candidate: candidateRef, decision: decisionRef}));
 it.each([[], ['--candidate', candidateRef], ['--candidate'], ['--candidate', '../source.md', '--decision', decisionRef],
  ['--candidate', candidateRef, '--decision', decisionRef, '--publish', 'yes'],
  ['--candidate', candidateRef, '--candidate', candidateRef, '--decision', decisionRef]].map(args => ({args})))('rejects missing, escaping, duplicate or expanded flags: $args', ({args}) => expect(() => parsePromotionArguments(args)).toThrow());
});
