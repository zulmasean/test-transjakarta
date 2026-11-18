import { defineConfig, devices } from '@playwright/test';
import { requireEnv } from './config/env';

export default defineConfig({
  testDir: './tests',
  workers: 4,
  timeout: 60_000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: requireEnv('BASE_URL'),
    headless: true,
    viewport: { width: 1366, height: 768 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
