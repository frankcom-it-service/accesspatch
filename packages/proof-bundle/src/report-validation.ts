const REQUIRED_LINKS = [
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

export function validateReportHtml(html: string): void {
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
  ];
  for (const [name, pattern] of requirements) {
    if (!pattern.test(html)) issues.push(name);
  }
  for (const link of REQUIRED_LINKS) {
    if (!html.includes(`href="${link}"`)) issues.push(`link:${link}`);
  }
  if (/<script\b|<img\b|https?:\/\//i.test(html)) {
    issues.push('remote_or_active_content');
  }
  if (issues.length > 0) {
    throw new Error(`report_html_invalid:${issues.join(',')}`);
  }
}
