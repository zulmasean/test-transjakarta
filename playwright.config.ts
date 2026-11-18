import { defineConfig, devices } from '@playwright/test';
import { requireEnv } from './config/env';

export default defineConfig({
  testDir: './tests',
  workers: 2, //contoh saya akan menjalankan testcase dengan 2 workers
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
