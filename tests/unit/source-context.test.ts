import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { readBoundedSourceContext } from '../../packages/evidence-collector/src/source-context.ts';

const allowedFile = 'apps/demo-checkout/src/App.tsx' as const;

async function createRepository(content: string): Promise<{
  base: string;
  repository: string;
  file: string;
}> {
  const base = await mkdtemp(join(tmpdir(), 'accesspatch-context-'));
  const repository = join(base, 'repository');
  const file = join(repository, allowedFile);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content, 'utf8');
  return { base, repository, file };
}

const request = {
  file: allowedFile,
  startMarker: 'START',
  endMarker: 'END',
  selectionBasis: 'Unit-test bounded excerpt.',
};

test('valid bounded source context is accepted', async () => {
  const fixture = await createRepository('prefix\nSTART bounded END\nsuffix\n');
  try {
    const context = await readBoundedSourceContext(fixture.repository, request);
    assert.equal(context.excerpt, 'START bounded END');
    assert.equal(context.completeFile, false);
  } finally {
    await rm(fixture.base, { recursive: true, force: true });
  }
});

test('missing source markers are rejected', async () => {
  const fixture = await createRepository('prefix without markers\n');
  try {
    await assert.rejects(
      readBoundedSourceContext(fixture.repository, request),
      /markers were not found/,
    );
  } finally {
    await rm(fixture.base, { recursive: true, force: true });
  }
});

test('over-limit source context is rejected', async () => {
  const fixture = await createRepository(
    `prefix\nSTART${'x'.repeat(1201)}END\nsuffix\n`,
  );
  try {
    await assert.rejects(
      readBoundedSourceContext(fixture.repository, request),
      /bounded excerpt limit/,
    );
  } finally {
    await rm(fixture.base, { recursive: true, force: true });
  }
});

test('complete trimmed source file selection is rejected', async () => {
  const fixture = await createRepository('START bounded END\n');
  try {
    await assert.rejects(
      readBoundedSourceContext(fixture.repository, request),
      /must not contain the complete file/,
    );
  } finally {
    await rm(fixture.base, { recursive: true, force: true });
  }
});

test('allowlisted symlink resolving outside repository is rejected', async (context) => {
  const fixture = await createRepository('placeholder\n');
  const outsideFile = join(fixture.base, 'outside.tsx');
  await writeFile(outsideFile, 'prefix\nSTART outside END\nsuffix\n', 'utf8');
  await rm(fixture.file);

  try {
    try {
      await symlink(outsideFile, fixture.file, 'file');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'EPERM' || code === 'EACCES' || code === 'ENOTSUP') {
        context.skip(`Symlink creation unavailable: ${code}`);
        return;
      }
      throw error;
    }

    await assert.rejects(
      readBoundedSourceContext(fixture.repository, request),
      /real path escaped the repository/,
    );
  } finally {
    await rm(fixture.base, { recursive: true, force: true });
  }
});
