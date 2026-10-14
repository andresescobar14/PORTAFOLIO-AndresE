import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const agent = process.env.npm_config_user_agent;
if (!agent?.startsWith('pnpm/')) {
  throw new Error('Este proyecto se gestiona exclusivamente con pnpm.');
}
function check(directory) {
  for (const forbidden of ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'bun.lock', 'bun.lockb']) {
    if (existsSync(join(directory, forbidden))) throw new Error(`Lockfile no permitido: ${join(directory, forbidden)}`);
  }
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !['.git', 'node_modules', '.next', 'coverage', 'test-results', 'playwright-report'].includes(entry.name)) check(join(directory, entry.name));
  }
}
check(root);
console.log('Gestor y lockfiles verificados: solo pnpm.');
