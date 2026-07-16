import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const configuredPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const systemPath = '/usr/bin/chromium';
const executablePath = configuredPath || (existsSync(systemPath) ? systemPath : undefined);
const judgeWorkflow = process.env.ACCESSPATCH_JUDGE_WORKFLOW === '1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['line']],
  outputDir: judgeWorkflow
    ? '.accesspatch/work/judge-verify/report-test'
    : 'test-results/report-smoke',
  use: {
    screenshot: 'off',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: { width: 1280, height: 720 },
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],
});
