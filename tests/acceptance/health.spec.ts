import { test, expect } from '@playwright/test';

test.describe('Health Endpoint', () => {
  test('should return 200 OK', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('should return valid JSON', async ({ request }) => {
    const response = await request.get('/api/health');
    const data = await response.json();

    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service', 'driftwatch-app');
  });

  test('should have valid timestamp', async ({ request }) => {
    const response = await request.get('/api/health');
    const data = await response.json();

    const timestamp = new Date(data.timestamp);
    expect(timestamp.toString()).not.toBe('Invalid Date');

    // Check timestamp is recent (within last 5 seconds)
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    expect(diff).toBeLessThan(5000);
  });
});
