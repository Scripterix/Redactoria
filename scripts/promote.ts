import { parsePromotionArguments } from '../engine/promotion/contract.ts';
import { promote } from '../engine/promotion/gate.ts';
import { loadEditorialInput, project } from './editorial-input.ts';

try {
 const args = parsePromotionArguments(process.argv.slice(2));
 const record = await promote({ project, ...args, loadEditorial: loadEditorialInput });
 console.log('PROMOTED_LOCAL: ' + record.destination);
 console.log('Article SHA-256: ' + record.articleHash);
 console.log('Local URL: http://localhost:4321' + record.localPath);
 console.log('STOP: human visual review required. No remote publication approval.');
} catch (error) {
 console.error('Promotion STOP: ' + (error instanceof Error ? error.message : String(error)));
 process.exitCode = 1;
}
