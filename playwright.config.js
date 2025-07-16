import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect:{
  timeout:5000
  },
  reporter: 'html',
  projects : [
    {
    name: 'Chrome',
    use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on', //retain-on-failure,
    viewport: {width: 720, height: 1024},
    baseURL: 'https://parabank.parasoft.com/',
  }},
  {
    name: 'Safari',
    use: {
    browserName: 'webkit',
    headless: false,
    ...devices['iPhone 15 Pro'],
    screenshot: 'on',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true, //allow test to get thru the ssl error
    permissions: ['geolocation'], //alow geolocation for the app
    trace: 'on', //retain-on-failure,
    baseURL: 'https://parabank.parasoft.com/',
  },
  }]
});

