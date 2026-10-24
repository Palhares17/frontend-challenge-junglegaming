import { defineConfig } from '@playwright/test';
import base from './playwright.config';
const deployedUrl = process.env.PRODUCTION_BASE_URL;

export default defineConfig({
  ...base,
  testDir: './tests/production',
  testIgnore: [],
  use: { ...base.use, baseURL: deployedUrl ?? 'http://127.0.0.1:4185' },
  webServer: deployedUrl ? undefined : {
    command: 'pnpm preview --host 127.0.0.1 --port 4185 --strictPort',
    url: 'http://127.0.0.1:4185',
    reuseExistingServer: false,
  },
});
