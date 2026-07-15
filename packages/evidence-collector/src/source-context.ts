import { readFile, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import {
  ALLOWED_TARGET_FILES,
  EVIDENCE_SCHEMA_VERSION,
  type BoundedSourceContext,
} from '@accesspatch/shared-types';

type ContextRequest = {
  file: (typeof ALLOWED_TARGET_FILES)[number];
  startMarker: string;
  endMarker: string;
  selectionBasis: string;
};

const MAXIMUM_CONTEXT_CHARACTERS = 1200;

function escapesDirectory(directory: string, candidate: string): boolean {
  const relativePath = relative(directory, candidate);
  return (
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  );
}

export async function readBoundedSourceContext(
  repositoryRoot: string,
  request: ContextRequest,
): Promise<BoundedSourceContext> {
  if (!ALLOWED_TARGET_FILES.includes(request.file)) {
    throw new Error('Source context file is not allowlisted.');
  }

  const repositoryPath = await realpath(resolve(repositoryRoot));
  const requestedPath = resolve(repositoryPath, request.file);
  if (escapesDirectory(repositoryPath, requestedPath)) {
    throw new Error('Source context path escaped the repository.');
  }

  const absolutePath = await realpath(requestedPath);
  if (escapesDirectory(repositoryPath, absolutePath)) {
    throw new Error('Source context real path escaped the repository.');
  }

  const content = await readFile(absolutePath, 'utf8');
  const start = content.indexOf(request.startMarker);
  const endStart = content.indexOf(request.endMarker, start);

  if (start < 0 || endStart < 0) {
    throw new Error('Source context markers were not found.');
  }

  const excerpt = content
    .slice(start, endStart + request.endMarker.length)
    .trim();

  if (excerpt.length > MAXIMUM_CONTEXT_CHARACTERS) {
    throw new Error('Source context exceeded the bounded excerpt limit.');
  }

  if (excerpt === content.trim()) {
    throw new Error('Source context must not contain the complete file.');
  }

  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    file: request.file,
    selectionBasis: request.selectionBasis,
    excerpt,
    completeFile: false,
  };
}
