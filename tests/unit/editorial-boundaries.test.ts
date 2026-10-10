import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { writeEditorialArtifacts } from '../../engine/core/editorial-writer.ts';
import { parseEditorialArguments } from '../../scripts/editorial-input.ts';
describe('Narrow editorial LAB capabilities', () => {
 it.each(['writer', 'critic'] as const)('allows only %s own LAB output and preserves SOURCE/CONTENT', async role => {
  const root = await mkdtemp(join(tmpdir(), 'redactoria-editorial-test-')), source = join(root, 'source'), content = join(root, 'content');
  try {
   await mkdir(source); await mkdir(content); await mkdir(join(root, 'lab'));
   await writeFile(join(source, 'original.md'), 'unchanged source'); await writeFile(join(content, 'published.md'), 'unchanged content');
   const prefix = role === 'writer' ? 'drafts' : 'reviews';
   await writeEditorialArtifacts(root, source, role, { [prefix + '/fixture/result.json']: '{"status":"draft"}\n' });
   for (const path of ['../content/published.md', '../source/original.md', 'decisions/approval.json', (role === 'writer' ? 'reviews' : 'drafts') + '/fixture/result.json']) {
    await expect(writeEditorialArtifacts(root, source, role, { [path]: 'forbidden' })).rejects.toThrow('own LAB');
   }
   expect(await readFile(join(source, 'original.md'), 'utf8')).toBe('unchanged source');
   expect(await readFile(join(content, 'published.md'), 'utf8')).toBe('unchanged content');
  } finally { await rm(root, { recursive: true, force: true }); }
 });
 it.each(['source', 'content'] as const)('rejects a canonical path escape into %s', async destination => {
  const root = await mkdtemp(join(tmpdir(), 'redactoria-editorial-link-test-')), source = join(root, 'source');
  try {
   await mkdir(source); await mkdir(join(root, 'content')); await mkdir(join(root, 'lab/drafts'), { recursive: true });
   await symlink(join(root, destination), join(root, 'lab/drafts/escape'), 'junction');
   await expect(writeEditorialArtifacts(root, source, 'writer', { 'drafts/escape/forbidden.md': 'no write' })).rejects.toThrow('inside LAB');
  } finally { await rm(root, { recursive: true, force: true }); }
 });
 it('does not allow empty output or path traversal', async () => {
  await expect(writeEditorialArtifacts('.', '.', 'writer', {})).rejects.toThrow();
  await expect(writeEditorialArtifacts('.', '.', 'critic', { 'reviews/../escape.json': '{}' })).rejects.toThrow();
 });
 it('accepts minimal selectors and a preparation-only flag', () => {
  expect(parseEditorialArguments(['--topic', 'php-arrays', '--prepare'], '--topic').prepare).toBe(true);
  expect(parseEditorialArguments(['--draft', 'lab/drafts/php-arrays/article.md'], '--draft').selected).toBe('lab/drafts/php-arrays/article.md');
 });
 it.each([[], ['--topic', '../escape'], ['--topic', 'php-arrays', '--publish'], ['--topic', 'php-arrays', '--topic', 'again']].map(args => ({ args })))('rejects unsafe CLI flags $args', ({ args }) => {
  expect(() => parseEditorialArguments(args, '--topic')).toThrow();
 });
 it('rejects CONTENT as draft input', () => {
  expect(() => parseEditorialArguments(['--draft', 'content/articles/php-arrays.md'], '--draft')).toThrow('draft path');
 });
});

