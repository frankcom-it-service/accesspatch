import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';

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
