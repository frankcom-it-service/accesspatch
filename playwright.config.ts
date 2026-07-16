import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const resolveChromiumExecutablePath = () => {
  const configuredPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

  if (configuredPath) {
    return configuredPath;
  }

  const localSystemPath = '/usr/bin/chromium';
  return existsSync(localSystemPath) ? localSystemPath : undefined;
};

const chromiumExecutablePath = resolveChromiumExecutablePath();
const judgeWorkflow = process.env.ACCESSPATCH_JUDGE_WORKFLOW === '1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: judgeWorkflow
    ? [['line']]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
      ],
  ...(judgeWorkflow
    ? { outputDir: '.accesspatch/work/judge-verify/application-tests' }
    : {}),
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: judgeWorkflow ? 'off' : 'only-on-failure',
    trace: judgeWorkflow ? 'off' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: { width: 1280, height: 720 },
        ...(chromiumExecutablePath
          ? { launchOptions: { executablePath: chromiumExecutablePath } }
          : {}),
      },
    },
  ],
  webServer: {
    command:
      'pnpm --filter @accesspatch/demo-checkout dev --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
