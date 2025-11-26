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

test('fetchApodToday hits /apod/today', async () => {
  await fetchApodToday();
  expect(global.fetch).toHaveBeenCalled();
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.pathname).toBe('/api/apod/today'.replace('/api', '') ? '/apod/today' : '/apod/today'); // path segment
});

test('fetchApodByDate adds date query', async () => {
  await fetchApodByDate('2024-01-01');
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.searchParams.get('date')).toBe('2024-01-01');
});
