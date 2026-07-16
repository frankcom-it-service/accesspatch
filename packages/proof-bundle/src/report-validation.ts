import {
  ProofFindingsSchema,
  WCAG_MAPPING_DEFINITIONS,
  type ProofFindings,
} from '@accesspatch/shared-types';
import { assertSafeRelativePath } from './security.ts';

export const REQUIRED_REPORT_LINKS = [
  'summary.json',
  'findings.json',
  'journey-map.json',
  'repair-plan.json',
  'patch.diff',
  'replay.spec.ts',
  'wcag-map.csv',
  'manual-review.md',
  'audit-log.json',
  'test-results/before-baseline.json',
  'test-results/after-replay.json',
  'test-results/verification.json',
  'test-results/model-audit.json',
  'test-results/patch-audit.json',
] as const;

export function validateReportRelativeLinks(
  html: string,
  availablePaths: ReadonlySet<string>,
): string[] {
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const relativeLinks = links.filter(
    (link) => !link.startsWith('#') && !link.startsWith('https://'),
  );
  for (const link of relativeLinks) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.includes('?') || link.includes('#')) {
      throw new Error(`report_relative_link_unsafe:${link}`);
    }
    assertSafeRelativePath(link);
    if (!availablePaths.has(link)) {
      throw new Error(`report_relative_link_missing:${link}`);
    }
  }
  return relativeLinks;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

export function validateReportHtml(html: string, findings: ProofFindings): void {
  const validatedFindings = ProofFindingsSchema.parse(findings);
  const issues: string[] = [];
  const requirements: Array<[string, RegExp]> = [
    ['doctype', /^<!doctype html>/i],
    ['language', /<html\s+lang="en">/i],
    ['title', /<title>[^<]*AccessPatch[^<]*<\/title>/i],
    ['skip_link', /<a[^>]+href="#main-content"[^>]*>Skip to proof content<\/a>/i],
    ['header', /<header[\s>]/i],
    ['navigation', /<nav[\s>]/i],
    ['main', /<main\s+id="main-content"/i],
    ['footer', /<footer[\s>]/i],
    ['focus_style', /:focus-visible\s*\{[^}]*outline:/i],
    ['non_certification', /not a compliance certification/i],
    ['wcag_section', /<h2\s+id="wcag-heading">Source-backed WCAG 2\.2 mappings<\/h2>/i],
    ['informative_boundary', /Understanding documents are explanatory and informative/i],
  ];
  for (const [name, pattern] of requirements) {
    if (!pattern.test(html)) issues.push(name);
  }
  for (const link of REQUIRED_REPORT_LINKS) {
    if (!html.includes(`href="${link}"`)) issues.push(`link:${link}`);
  }

  const findingMappings = validatedFindings.findings.flatMap((finding) =>
    finding.wcagMappings.map((mapping) => ({ findingId: finding.findingId, ...mapping })),
  );
  const renderedReferences = [...html.matchAll(/data-wcag-reference="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const expectedReferences = WCAG_MAPPING_DEFINITIONS.map(
    (mapping) => mapping.wcagReference,
  );
  if (JSON.stringify(renderedReferences) !== JSON.stringify(expectedReferences)) {
    issues.push('wcag_mapping_inventory');
  }
  if (
    JSON.stringify(findingMappings.map(({ findingId, wcagReference }) => ({ findingId, wcagReference }))) !==
    JSON.stringify(
      WCAG_MAPPING_DEFINITIONS.map(({ findingId, wcagReference }) => ({ findingId, wcagReference })),
    )
  ) {
    issues.push('wcag_finding_relationships');
  }

  for (const mapping of WCAG_MAPPING_DEFINITIONS) {
    const expectedText = [
      `WCAG 2.2 ${mapping.wcagReference}: ${escapeHtml(mapping.referenceLabel)}`,
      `<strong>Level:</strong> ${mapping.conformanceLevel}`,
      `<code>${mapping.findingId}</code>`,
      escapeHtml(mapping.mappingBasis),
      `href="${mapping.normativeSourceUrl}"`,
      `href="${mapping.understandingSourceUrl}"`,
    ];
    if (expectedText.some((text) => !html.includes(text))) {
      issues.push(`wcag_mapping:${mapping.wcagReference}`);
    }
  }

  const expectedExternalUrls = WCAG_MAPPING_DEFINITIONS.flatMap((mapping) => [
    mapping.normativeSourceUrl,
    mapping.understandingSourceUrl,
  ]);
  const actualExternalUrls = [...html.matchAll(/href="(https:\/\/[^"<>]+)"/g)].map(
    (match) => match[1],
  );
  if (JSON.stringify(sorted(actualExternalUrls)) !== JSON.stringify(sorted(expectedExternalUrls))) {
    issues.push('external_link_allowlist');
  }
  const externalIndicators = html.match(
    /<a class="external-link" data-external="true" href="https:\/\/[^"<>]+">[^<]*(?:<span class="external-indicator">\(external, W3C\)<\/span>)<\/a>/g,
  );
  if (externalIndicators?.length !== expectedExternalUrls.length) {
    issues.push('external_link_identification');
  }

  if (
    /<script\b|<img\b|<link\b|<iframe\b|<object\b|<embed\b|@import\b|url\s*\(\s*["']?https?:|\b(?:src|action)="https?:/i.test(
      html,
    )
  ) {
    issues.push('remote_or_active_content');
  }
  if (
    /\b(?:achieves?|establishes?|proves?|demonstrates?|guarantees?)\s+(?:full\s+)?WCAG(?:\s+2\.2)?\s+conformance\b/i.test(
      html,
    )
  ) {
    issues.push('unsupported_conformance_claim');
  }
  if (issues.length > 0) {
    throw new Error(`report_html_invalid:${issues.join(',')}`);
  }
}
