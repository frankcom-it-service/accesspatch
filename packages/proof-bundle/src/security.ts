import { isAbsolute, normalize } from 'node:path';

const forbiddenContentPatterns = [
  { category: 'credential', pattern: /sk-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}/ },
  { category: 'environment_value', pattern: /OPENAI_API_KEY\s*=\s*\S+|(?:^|\s)[A-Z][A-Z0-9_]{2,}\s*=\s*[^\s#]+/m },
  { category: 'absolute_local_path', pattern: /(?:\/home\/[^/\s]+|\/Users\/[^/\s]+|[A-Za-z]:\\Users\\[^\\\s]+)/ },
  { category: 'sensitive_identifier', pattern: /\b(?:proj|org)-[A-Za-z0-9_-]{8,}\b/ },
  { category: 'raw_prompt_or_response', pattern: /"(?:rawPrompt|rawResponse|promptText|responseBody)"\s*:/i },
  { category: 'unsupported_compliance_claim', pattern: /\b(?:is|are)\s+(?:fully\s+)?(?:WCAG|BFSG|EAA)\s+(?:certified|compliant)\b|(?<!not )\bprovides?\s+(?:WCAG|BFSG|EAA)\s+certification\b|\b(?:guarantees?|certifies?)\s+(?:WCAG|BFSG|EAA|legal compliance)\b/i },
] as const;

export function assertSafeRelativePath(path: string): void {
  const normalized = normalize(path).replaceAll('\\', '/');
  if (
    !path ||
    path.includes('\\') ||
    path.includes('\0') ||
    isAbsolute(path) ||
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized.split('/').includes('..')
  ) {
    throw new Error(`unsafe_bundle_path:${path}`);
  }
}

export function scanGeneratedText(relativePath: string, content: string): void {
  assertSafeRelativePath(relativePath);
  for (const { category, pattern } of forbiddenContentPatterns) {
    if (pattern.test(content)) {
      throw new Error(`generated_content_rejected:${relativePath}:${category}`);
    }
  }
}
