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

test('fetchApodToday hits /apod without query', async () => {
  await fetchApodToday();
  expect(global.fetch).toHaveBeenCalled();
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.pathname).toBe('/apod');
  expect(url.search).toBe('');
});

test('fetchApodByDate includes apod_date query only', async () => {
  await fetchApodByDate('2024-01-01');
  const url = new URL(global.fetch.mock.calls[0][0]);
  const apodDateParam = url.searchParams.get('apod_date');
  expect(apodDateParam).toBe('2024-01-01');
});
