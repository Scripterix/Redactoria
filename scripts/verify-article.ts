import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { verifyArticle } from '../engine/validation/article-verification.ts';
import { runVerifyArticleCli } from '../engine/validation/article-verification-cli.ts';

const projectDirectory = resolve(fileURLToPath(new URL('../', import.meta.url)));
const sourceDirectory = resolve(projectDirectory, '../temp-ogwo/posts');

const result = await runVerifyArticleCli(process.argv.slice(2), topic => verifyArticle({
	projectDirectory,
	sourceDirectory,
	topic,
}));

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exitCode = result.exitCode;
