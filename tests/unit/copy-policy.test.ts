import assert from 'node:assert/strict';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import {
  copyPathDisposition,
  copyRepositoryWithoutSymlinks,
} from '../../packages/patch-engine/src/copy-policy.ts';

test('.env.example remains eligible for the isolated copy', () => {
  assert.equal(copyPathDisposition('.env.example'), 'include');
});

test('common local credential files are excluded', () => {
  for (const path of [
    '.env',
    '.env.local',
    'config/.npmrc',
    'config/.netrc',
    'certs/private.pem',
    'certs/private.key',
    'certs/private.p12',
    'certs/private.pfx',
  ]) {
    assert.equal(copyPathDisposition(path), 'exclude', path);
  }
});

test('directories named secrets are excluded', () => {
  assert.equal(copyPathDisposition('secrets'), 'exclude');
  assert.equal(copyPathDisposition('config/secrets/token.txt'), 'exclude');
});

test('ordinary source and test files remain eligible', () => {
  assert.equal(copyPathDisposition('apps/demo-checkout/src/App.tsx'), 'include');
  assert.equal(copyPathDisposition('tests/e2e/keyboard-baseline.spec.ts'), 'include');
});

test('generated output directories remain excluded', () => {
  for (const path of [
    '.accesspatch/runs/phase1/evidence.json',
    '.accesspatch/work/copy/App.tsx',
    'apps/demo-checkout/dist/index.html',
    'test-results/result.json',
    'playwright-report/index.html',
    'coverage/report.json',
  ]) {
    assert.equal(copyPathDisposition(path), 'exclude', path);
  }
});

test('copy keeps ordinary source and tests while omitting credentials and output', async () => {
  const base = await mkdtemp(join(tmpdir(), 'accesspatch-copy-policy-'));
  const repository = join(base, 'repository');
  const workingCopy = join(base, 'working-copy');
  const fixtures = {
    '.env.example': 'EXAMPLE_VALUE=\n',
    '.env.local': 'not-a-real-secret\n',
    '.npmrc': 'placeholder\n',
    'apps/demo-checkout/src/App.tsx': 'export const app = true;\n',
    'tests/e2e/example.spec.ts': 'export const test = true;\n',
    'dist/index.html': 'generated\n',
    'secrets/token.txt': 'placeholder\n',
  };

  try {
    for (const [relativePath, content] of Object.entries(fixtures)) {
      const path = join(repository, relativePath);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, 'utf8');
    }

    await copyRepositoryWithoutSymlinks(repository, workingCopy);
    assert.equal(
      await readFile(join(workingCopy, '.env.example'), 'utf8'),
      fixtures['.env.example'],
    );
    assert.equal(
      await readFile(
        join(workingCopy, 'apps/demo-checkout/src/App.tsx'),
        'utf8',
      ),
      fixtures['apps/demo-checkout/src/App.tsx'],
    );
    assert.equal(
      await readFile(join(workingCopy, 'tests/e2e/example.spec.ts'), 'utf8'),
      fixtures['tests/e2e/example.spec.ts'],
    );
    for (const excludedPath of [
      '.env.local',
      '.npmrc',
      'dist/index.html',
      'secrets/token.txt',
    ]) {
      await assert.rejects(access(join(workingCopy, excludedPath)), {
        code: 'ENOENT',
      });
    }
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});

test('included source symlink is rejected without following it', async (context) => {
  const base = await mkdtemp(join(tmpdir(), 'accesspatch-copy-symlink-'));
  const repository = join(base, 'repository');
  const workingCopy = join(base, 'working-copy');
  const sourceDirectory = join(repository, 'src');
  const outsideFile = join(base, 'outside.txt');
  const linkPath = join(sourceDirectory, 'linked.txt');

  try {
    await mkdir(sourceDirectory, { recursive: true });
    await writeFile(outsideFile, 'must not be copied', 'utf8');
    try {
      await symlink(outsideFile, linkPath, 'file');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'EPERM' || code === 'EACCES' || code === 'ENOTSUP') {
        context.skip(`Symlink creation unavailable: ${code}`);
        return;
      }
      throw error;
    }

    await assert.rejects(
      copyRepositoryWithoutSymlinks(repository, workingCopy),
      (error: unknown) =>
        error instanceof Error &&
        error.message === 'included_source_symlink:src/linked.txt' &&
        !error.message.includes(base),
    );
    await assert.rejects(access(join(workingCopy, 'src/linked.txt')), {
      code: 'ENOENT',
    });
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
