import { fetchApodToday, fetchApodByDate } from '../services/apiClient';

const originalFetch = global.fetch;

beforeEach(() => {
  process.env.REACT_APP_BACKEND_URL = 'http://test/api';
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({}),
  }));
});

afterEach(() => {
  global.fetch = originalFetch;
});

test('fetchApodToday hits /apod/today (or falls back to /apod)', async () => {
  await fetchApodToday();
  expect(global.fetch).toHaveBeenCalled();
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(['/apod/today', '/apod']).toContain(url.pathname);
});

test('fetchApodByDate includes date or apod_date query', async () => {
  await fetchApodByDate('2024-01-01');
  const url = new URL(global.fetch.mock.calls[0][0]);
  const dateParam = url.searchParams.get('date');
  const apodDateParam = url.searchParams.get('apod_date');
  expect(dateParam === '2024-01-01' || apodDateParam === '2024-01-01').toBe(true);
});
