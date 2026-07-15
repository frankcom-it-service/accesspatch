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

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
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
