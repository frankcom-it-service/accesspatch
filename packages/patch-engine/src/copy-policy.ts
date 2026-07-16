import {
  copyFile,
  lstat,
  mkdir,
  readdir,
  realpath,
} from 'node:fs/promises';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import { MUTATION_GUARD_FIXTURE_FILES } from './constants.ts';

const excludedPathSegments = new Set([
  '.git',
  '.accesspatch',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'playwright-report',
  'test-results',
  'traces',
  'screenshots',
  'secrets',
]);

const excludedCredentialNames = new Set(['.npmrc', '.netrc']);
const excludedCredentialExtensions = ['.pem', '.key', '.p12', '.pfx'];

export type CopyPathDisposition = 'include' | 'exclude';

export function copyPathDisposition(relativePath: string): CopyPathDisposition {
  const normalizedPath = relativePath.replaceAll('\\', '/');
  if (!normalizedPath) {
    return 'include';
  }

  const segments = normalizedPath.split('/');
  if (segments.some((segment) => excludedPathSegments.has(segment))) {
    return 'exclude';
  }

  const name = basename(normalizedPath);
  if (name.startsWith('.env') && name !== '.env.example') {
    return 'exclude';
  }
  if (excludedCredentialNames.has(name)) {
    return 'exclude';
  }
  if (
    excludedCredentialExtensions.some((extension) =>
      name.toLowerCase().endsWith(extension),
    )
  ) {
    return 'exclude';
  }

  return 'include';
}

export async function copyRepositoryWithoutSymlinks(
  repositoryRoot: string,
  workingCopyRoot: string,
): Promise<void> {
  await mkdir(workingCopyRoot, { recursive: true });

  async function copyDirectory(
    sourceDirectory: string,
    destinationDirectory: string,
    relativeDirectory: string,
  ): Promise<void> {
    const entries = await readdir(sourceDirectory, { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = relativeDirectory
        ? `${relativeDirectory}/${entry.name}`
        : entry.name;
      if (copyPathDisposition(relativePath) === 'exclude') {
        continue;
      }

      const source = join(sourceDirectory, entry.name);
      const destination = join(destinationDirectory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`included_source_symlink:${relativePath}`);
      }
      if (entry.isDirectory()) {
        await mkdir(destination, { recursive: true });
        await copyDirectory(source, destination, relativePath);
        continue;
      }
      if (!entry.isFile()) {
        throw new Error(`unsupported_source_entry:${relativePath}`);
      }
      await copyFile(source, destination);
    }
  }

  await copyDirectory(repositoryRoot, workingCopyRoot, '');
}

const mutationFixtureFiles = new Set<string>(MUTATION_GUARD_FIXTURE_FILES);

function slash(path: string): string {
  return path.split(sep).join('/');
}

export function assertAllowedMutationFixturePath(relativePath: string): void {
  const normalizedPath = slash(relativePath);
  if (
    isAbsolute(relativePath) ||
    normalizedPath === '..' ||
    normalizedPath.startsWith('../') ||
    normalizedPath.includes('/../') ||
    !mutationFixtureFiles.has(normalizedPath)
  ) {
    throw new Error(`mutation_fixture_path_not_allowed:${normalizedPath}`);
  }
}

export function mutationCopyPathDisposition(
  relativePath: string,
): CopyPathDisposition {
  try {
    assertAllowedMutationFixturePath(relativePath);
    return 'include';
  } catch {
    return 'exclude';
  }
}

async function assertIncludedPathHasNoSymlink(
  repositoryRoot: string,
  relativePath: string,
): Promise<void> {
  const segments = slash(relativePath).split('/');
  let current = repositoryRoot;
  for (const segment of segments) {
    current = join(current, segment);
    const stats = await lstat(current);
    if (stats.isSymbolicLink()) {
      throw new Error(`included_source_symlink:${relativePath}`);
    }
  }
}

export async function copyMutationFixtureWithoutSymlinks(
  repositoryRoot: string,
  workingCopyRoot: string,
): Promise<void> {
  const resolvedRepositoryRoot = resolve(repositoryRoot);
  const realRepositoryRoot = await realpath(resolvedRepositoryRoot);

  for (const relativePath of MUTATION_GUARD_FIXTURE_FILES) {
    assertAllowedMutationFixturePath(relativePath);
    await assertIncludedPathHasNoSymlink(resolvedRepositoryRoot, relativePath);
    const source = resolve(resolvedRepositoryRoot, relativePath);
    const realSource = await realpath(source);
    const containment = relative(realRepositoryRoot, realSource);
    if (
      containment === '..' ||
      containment.startsWith(`..${sep}`) ||
      isAbsolute(containment)
    ) {
      throw new Error(`mutation_fixture_path_escape:${relativePath}`);
    }
    const stats = await lstat(source);
    if (!stats.isFile()) {
      throw new Error(`unsupported_source_entry:${relativePath}`);
    }
    const destination = resolve(workingCopyRoot, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
}
