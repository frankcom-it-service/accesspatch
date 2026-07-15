import type {
  AfterReplayResult,
  AuditLog,
  BeforeBaselineResult,
  JourneyMap,
  ProofFindings,
} from '@accesspatch/shared-types';
import {
  AFTER_RESULT_SCHEMA_VERSION,
  AUDIT_LOG_SCHEMA_VERSION,
  BEFORE_RESULT_SCHEMA_VERSION,
  JOURNEY_MAP_SCHEMA_VERSION,
  NON_CERTIFICATION_STATEMENT,
  PROOF_FINDINGS_SCHEMA_VERSION,
  WCAG_MAPPING_CLAIM_BOUNDARY,
  WCAG_MAPPING_DEFINITIONS,
} from '@accesspatch/shared-types';
import {
  PHASE1C_IMPLEMENTATION_COMMIT,
  REVIEWED_SOURCE_HASHES,
} from './constants.ts';
import type { ReviewedBundleSources } from './input.ts';

const PHASE1A_COMMIT = '18c3828431348c8eadfc93aaae3e4d92ec4f3bcf';
const PHASE1B_COMMIT = '207e0559d0d7664a24dcb297fb40b37700f36208';

function mappingsForFinding(findingId: string) {
  return WCAG_MAPPING_DEFINITIONS.filter(
    (mapping) => mapping.findingId === findingId,
  ).map(({ findingId: _findingId, ...mapping }) => ({
    ...mapping,
    manualReviewRequired: true as const,
    claimBoundary: WCAG_MAPPING_CLAIM_BOUNDARY,
  }));
}

export function createFindings(sources: ReviewedBundleSources): ProofFindings {
  return {
    schemaVersion: PROOF_FINDINGS_SCHEMA_VERSION,
    journeyId: sources.evidence.journey.journeyId,
    findings: [
      {
        ...sources.evidence.findings[0],
        repairStatus: 'verified_repaired_in_isolated_copy',
        verificationArtifact: 'test-results/verification.json',
        wcagMappings: mappingsForFinding(sources.evidence.findings[0].findingId),
      },
      {
        ...sources.evidence.findings[1],
        repairStatus: 'verified_repaired_in_isolated_copy',
        verificationArtifact: 'test-results/verification.json',
        wcagMappings: mappingsForFinding(sources.evidence.findings[1].findingId),
      },
    ],
  };
}

export function createJourneyMap(): JourneyMap {
  return {
    schemaVersion: JOURNEY_MAP_SCHEMA_VERSION,
    journeyId: 'demo-checkout-keyboard-v1',
    inputMode: 'keyboard',
    states: [
      { stateId: 'product-page', label: 'Product page rendered', evidenceReference: 'findings.json' },
      { stateId: 'cart-populated', label: 'Product added to cart', evidenceReference: 'findings.json' },
      { stateId: 'checkout-opened', label: 'Checkout opened', evidenceReference: 'findings.json' },
      { stateId: 'checkout-form', label: 'Checkout form reached', evidenceReference: 'findings.json' },
      { stateId: 'barriers-observed', label: 'Email-name and focus-visible barriers observed', evidenceReference: 'test-results/before-baseline.json' },
      { stateId: 'sample-form-completed', label: 'Sample shipping and contact data entered', evidenceReference: 'test-results/before-baseline.json' },
      { stateId: 'confirmation-reached', label: 'Original controlled journey reached confirmation', evidenceReference: 'test-results/before-baseline.json' },
      { stateId: 'isolated-replay-completed', label: 'Isolated repaired replay completed', evidenceReference: 'test-results/after-replay.json' },
    ],
    transitions: [
      { from: 'product-page', to: 'cart-populated', keyboardAction: 'Tab to Add product to cart, then press Enter.' },
      { from: 'cart-populated', to: 'checkout-opened', keyboardAction: 'Tab to Open checkout, then press Enter.' },
      { from: 'checkout-opened', to: 'checkout-form', keyboardAction: 'Verify keyboard focus reaches the checkout heading and form sequence.' },
      { from: 'checkout-form', to: 'barriers-observed', keyboardAction: 'Tab through fields to the primary action and inspect accessible name and computed focus styles.' },
      { from: 'barriers-observed', to: 'sample-form-completed', keyboardAction: 'Enter the predefined sample data using keyboard input.' },
      { from: 'sample-form-completed', to: 'confirmation-reached', keyboardAction: 'Press Enter on Continue to confirmation.' },
      { from: 'confirmation-reached', to: 'isolated-replay-completed', keyboardAction: 'Run the same generated keyboard replay in the isolated repaired copy.' },
    ],
    screenshotsOrTracesIncluded: false,
  };
}

export function createBeforeResult(sources: ReviewedBundleSources): BeforeBaselineResult {
  const focus = sources.evidence.findings[1].focusMetadata;
  if (!focus) {
    throw new Error('before_focus_metadata_missing');
  }
  return {
    schemaVersion: BEFORE_RESULT_SCHEMA_VERSION,
    sourcePhase: 'Phase 1A/1B',
    executedDuringPhase2A: false,
    command: 'pnpm test:baseline',
    expectedExitBehavior: 'non-zero because both controlled barriers remain',
    status: 'intentionally_failed',
    findingIds: ['CONTROLLED_BARRIER_EMAIL_NAME', 'CONTROLLED_BARRIER_FOCUS_VISIBLE'],
    axeResult: sources.evidence.axeSummary,
    focusValues: {
      outlineStyle: 'none',
      outlineWidth: focus.outlineWidth,
      boxShadow: 'none',
      visibleIndicatorDetected: false,
    },
    confirmationReached: sources.evidence.journey.confirmationReached,
    sourceArtifact: 'findings.json',
  };
}

export function createAfterResult(sources: ReviewedBundleSources): AfterReplayResult {
  return {
    schemaVersion: AFTER_RESULT_SCHEMA_VERSION,
    sourcePhase: 'Phase 1C',
    executedDuringPhase2A: false,
    command: 'playwright test replay.spec.ts --config=<ephemeral-config>',
    expectedExitBehavior: 'zero',
    status: 'passed',
    repairedFindingIds: [...sources.verification.repairedFindingIds],
    axeResult: sources.verification.axeResult,
    focusValues: sources.verification.repairedFocusComputedValues,
    confirmationReached: sources.verification.confirmationReached,
    sourceArtifact: 'test-results/verification.json',
  };
}

function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function createWcagMap(findings: ProofFindings): string {
  const headers = [
    'finding_id',
    'journey_step',
    'selector',
    'safe_fix_class',
    'wcag_version',
    'wcag_reference',
    'reference_label',
    'conformance_level',
    'normative_source_url',
    'understanding_source_url',
    'mapping_basis',
    'automated_evidence',
    'repair_verification',
    'manual_review_required',
    'claim_boundary',
  ];
  const rows = findings.findings.flatMap((finding) =>
    finding.wcagMappings.map((mapping) => [
      finding.findingId,
      finding.stepId,
      finding.affectedSelector,
      finding.safeFixClass,
      mapping.wcagVersion,
      mapping.wcagReference,
      mapping.referenceLabel,
      mapping.conformanceLevel,
      mapping.normativeSourceUrl,
      mapping.understandingSourceUrl,
      mapping.mappingBasis,
      finding.observedCondition,
      finding.expectedCondition,
      finding.requiredHumanReview.join(' | '),
      mapping.claimBoundary,
    ]),
  );
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`;
}

export function createAuditLog(
  sources: ReviewedBundleSources,
  generatedAtUtc: string,
  preAuditHashes: Record<string, string>,
): AuditLog {
  return {
    schemaVersion: AUDIT_LOG_SCHEMA_VERSION,
    entries: [
      {
        timestampUtc: null,
        phase: 'Phase 1A',
        action: 'Run the original controlled keyboard baseline.',
        tool: 'Playwright and axe',
        model: null,
        inputArtifactHashes: {},
        outputArtifactHashes: { evidence: REVIEWED_SOURCE_HASHES.evidence },
        status: 'passed',
        gate: 'Expected non-zero baseline reached confirmation and reported only both controlled barriers.',
        relevantCommit: PHASE1A_COMMIT,
        privacySafetyNotes: 'No screenshots, traces, personal data, or credentials are included.',
      },
      {
        timestampUtc: sources.evidence.capturedAtUtc,
        phase: 'Phase 1B',
        action: 'Collect normalized keyboard-journey evidence.',
        tool: 'Playwright, axe, and AccessPatch evidence collector',
        model: null,
        inputArtifactHashes: {},
        outputArtifactHashes: { evidence: REVIEWED_SOURCE_HASHES.evidence },
        status: 'completed',
        gate: 'Evidence schema accepted exactly two controlled findings and bounded source context.',
        relevantCommit: PHASE1B_COMMIT,
        privacySafetyNotes: 'Only allowlisted bounded excerpts and normalized test evidence were retained.',
      },
      {
        timestampUtc: sources.modelAudit.timestampUtc,
        phase: 'Phase 1B',
        action: 'Produce one structured evidence-based repair plan.',
        tool: 'OpenAI Responses API Structured Outputs',
        model: 'gpt-5.6-sol',
        inputArtifactHashes: { evidence: REVIEWED_SOURCE_HASHES.evidence },
        outputArtifactHashes: {
          repairPlan: REVIEWED_SOURCE_HASHES.repairPlan,
          modelAudit: REVIEWED_SOURCE_HASHES.modelAudit,
        },
        status: 'completed',
        gate: 'Schema validation completed with store false.',
        relevantCommit: PHASE1B_COMMIT,
        privacySafetyNotes: 'No raw prompt, raw response, credential, or unrelated repository content is stored.',
      },
      {
        timestampUtc: sources.modelAudit.timestampUtc,
        phase: 'Phase 1B',
        action: 'Accept the repair plan under deterministic policy.',
        tool: 'AccessPatch repair-reasoner policy validator',
        model: null,
        inputArtifactHashes: { repairPlan: REVIEWED_SOURCE_HASHES.repairPlan },
        outputArtifactHashes: { approvedRepairPlan: REVIEWED_SOURCE_HASHES.repairPlan },
        status: 'accepted',
        gate: 'Exactly two approved finding-to-fix mappings and allowlisted target files passed.',
        relevantCommit: PHASE1B_COMMIT,
        privacySafetyNotes: 'Model prose was not interpreted as executable source code.',
      },
      {
        timestampUtc: sources.patchAudit.timestampUtc,
        phase: 'Phase 1C',
        action: 'Generate an isolated deterministic two-file repair patch.',
        tool: 'AccessPatch patch engine',
        model: null,
        inputArtifactHashes: {
          evidence: REVIEWED_SOURCE_HASHES.evidence,
          repairPlan: REVIEWED_SOURCE_HASHES.repairPlan,
        },
        outputArtifactHashes: { patch: REVIEWED_SOURCE_HASHES.patch },
        status: 'accepted',
        gate: 'Patch policy accepted only App.tsx and styles.css changes.',
        relevantCommit: PHASE1C_IMPLEMENTATION_COMMIT,
        privacySafetyNotes: 'Mutation occurred only in a disposable copy; the original fixture was preserved.',
      },
      {
        timestampUtc: sources.patchAudit.timestampUtc,
        phase: 'Phase 1C',
        action: 'Verify the isolated repaired keyboard replay.',
        tool: 'Playwright, axe, and AccessPatch patch engine',
        model: null,
        inputArtifactHashes: {
          patch: REVIEWED_SOURCE_HASHES.patch,
          replay: REVIEWED_SOURCE_HASHES.replay,
        },
        outputArtifactHashes: {
          verification: REVIEWED_SOURCE_HASHES.verification,
          patchAudit: REVIEWED_SOURCE_HASHES.patchAudit,
          manualReview: REVIEWED_SOURCE_HASHES.manualReview,
        },
        status: 'passed',
        gate: 'Zero axe violations, visible focus, confirmation reached, and cleanup removed the copy.',
        relevantCommit: PHASE1C_IMPLEMENTATION_COMMIT,
        privacySafetyNotes: 'No trace, screenshot, absolute path, environment value, or credential was retained.',
      },
      {
        timestampUtc: generatedAtUtc,
        phase: 'Phase 2B',
        action: 'Generate and validate the canonical ignored Proof Bundle with source-backed WCAG mappings.',
        tool: 'AccessPatch proof-bundle generator',
        model: null,
        inputArtifactHashes: { ...REVIEWED_SOURCE_HASHES },
        outputArtifactHashes: preAuditHashes,
        status: 'generated',
        gate: 'Exact inventory, schemas, hashes, three allowlisted WCAG mappings, report structure, safety scan, and atomic replacement passed.',
        relevantCommit: null,
        privacySafetyNotes: 'Phase 2B is uncommitted; the bundle is ignored, narrowly mapped, and is not a tracked judge sample or certification.',
      },
    ],
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function createReportHtml(
  sources: ReviewedBundleSources,
  findings: ProofFindings,
): string {
  const findingCards = findings.findings
    .map(
      (finding) => `<article class="card" aria-labelledby="${escapeHtml(finding.findingId)}">
        <h3 id="${escapeHtml(finding.findingId)}">${escapeHtml(finding.findingId)}</h3>
        <p><strong>Selector:</strong> <code>${escapeHtml(finding.affectedSelector)}</code></p>
        <p><strong>Before:</strong> ${escapeHtml(finding.observedCondition)}</p>
        <p><strong>Verified repair:</strong> ${escapeHtml(finding.expectedCondition)}</p>
        <p><strong>Strategy:</strong> <code>${escapeHtml(finding.safeFixClass)}</code></p>
      </article>`,
    )
    .join('\n');
  const wcagMappingCards = findings.findings
    .flatMap((finding) =>
      finding.wcagMappings.map(
        (mapping) => `<article class="card mapping-card" data-wcag-reference="${mapping.wcagReference}">
        <h3>WCAG 2.2 ${mapping.wcagReference}: ${escapeHtml(mapping.referenceLabel)}</h3>
        <p><strong>Level:</strong> ${mapping.conformanceLevel}</p>
        <p><strong>Controlled finding:</strong> <code>${escapeHtml(finding.findingId)}</code></p>
        <p><strong>Evidence basis:</strong> ${escapeHtml(mapping.mappingBasis)}</p>
        <ul>
          <li><a class="external-link" data-external="true" href="${mapping.normativeSourceUrl}">Normative WCAG 2.2 criterion ${mapping.wcagReference} <span class="external-indicator">(external, W3C)</span></a></li>
          <li><a class="external-link" data-external="true" href="${mapping.understandingSourceUrl}">Understanding ${mapping.wcagReference} <span class="external-indicator">(external, W3C)</span></a></li>
        </ul>
        <p><strong>Boundary:</strong> ${escapeHtml(mapping.claimBoundary)}</p>
      </article>`,
      ),
    )
    .join('\n');
  const sourceHashes = Object.entries(REVIEWED_SOURCE_HASHES)
    .map(([name, hash]) => `<li><code>${escapeHtml(name)}</code>: <code>${hash}</code></li>`)
    .join('\n');
  const links = [
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
  ]
    .map((path) => `<li><a href="${path}">${path}</a></li>`)
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AccessPatch Controlled Journey Proof Bundle</title>
  <style>
    :root { color-scheme: light; font-family: system-ui, sans-serif; background: #f4f7fb; color: #172033; }
    * { box-sizing: border-box; }
    body { margin: 0; line-height: 1.55; }
    a { color: #0848a6; }
    a.external-link { text-decoration-thickness: .12em; text-underline-offset: .15em; }
    a:focus-visible { outline: 3px solid #b83b00; outline-offset: 3px; }
    .skip-link { position: absolute; left: 1rem; top: -4rem; background: #fff; padding: .75rem; z-index: 2; }
    .skip-link:focus { top: 1rem; }
    header, main, footer { width: min(72rem, calc(100% - 2rem)); margin-inline: auto; }
    header { padding-block: 2rem 1rem; }
    main { padding-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem; }
    .card, section { background: #fff; border: 1px solid #c9d3e2; border-radius: .6rem; padding: 1rem; margin-block: 1rem; }
    .metric { font-size: 1.2rem; font-weight: 700; }
    code { overflow-wrap: anywhere; }
    footer { border-top: 1px solid #c9d3e2; padding-block: 1.5rem; }
  </style>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to proof content</a>
  <header>
    <p>AccessPatch · Controlled feasibility evidence</p>
    <h1>Checkout keyboard journey Proof Bundle</h1>
    <p>This static report summarizes real reviewed Phase 1 artifacts. It makes no complete accessibility or legal compliance claim.</p>
  </header>
  <nav aria-label="Bundle files" class="card">
    <h2>Bundle files</h2>
    <ul>${links}</ul>
  </nav>
  <main id="main-content">
    <section aria-labelledby="journey-summary">
      <h2 id="journey-summary">Before and after journey</h2>
      <div class="grid">
        <div><p class="metric">Before: 2 findings</p><p>One axe <code>label</code> violation targeted <code>#email</code>; the focused primary control had no visible indicator.</p></div>
        <div><p class="metric">After: 0 automated findings</p><p>The isolated replay recorded zero axe violations, a <code>3px solid</code> outline, and confirmation reached.</p></div>
      </div>
    </section>
    <section aria-labelledby="findings-heading">
      <h2 id="findings-heading">Controlled findings</h2>
      <div class="grid">${findingCards}</div>
    </section>
    <section aria-labelledby="reasoning-heading">
      <h2 id="reasoning-heading">GPT-5.6 repair-plan summary</h2>
      <p>${escapeHtml(sources.repairPlan.evidenceBasedSummary)}</p>
      <p>The plan selected <code>associate_explicit_label</code> and <code>restore_focus_visible</code>. Deterministic templates—not model-generated code—implemented the isolated patch.</p>
    </section>
    <section aria-labelledby="wcag-heading">
      <h2 id="wcag-heading">Source-backed WCAG 2.2 mappings</h2>
      <p>The WCAG 2.2 standard links are normative. The Understanding documents are explanatory and informative. These mappings cover only the two controlled findings and do not establish conformance.</p>
      <div class="grid">${wcagMappingCards}</div>
    </section>
    <section aria-labelledby="changes-heading">
      <h2 id="changes-heading">Exact changed files</h2>
      <ul><li><code>apps/demo-checkout/src/App.tsx</code></li><li><code>apps/demo-checkout/src/styles.css</code></li></ul>
      <p>The original controlled fixture remains preserved and intentionally broken for comparison.</p>
    </section>
    <section aria-labelledby="review-heading">
      <h2 id="review-heading">Manual review and claim boundaries</h2>
      <p>Screen-reader announcement, label adjacency and wording, and visual focus appearance across backgrounds and states still require qualified human review.</p>
      <p><strong>${NON_CERTIFICATION_STATEMENT}</strong> This evidence covers only the defined checkout journey and two controlled findings; it does not provide WCAG certification or BFSG or EAA legal assurance and does not replace disabled-user testing.</p>
    </section>
    <details>
      <summary>Reviewed source artifact hashes</summary>
      <ul>${sourceHashes}</ul>
    </details>
  </main>
  <footer><p>Generated locally without remote scripts, styles, fonts, images, or network calls.</p></footer>
</body>
</html>
`;
}
