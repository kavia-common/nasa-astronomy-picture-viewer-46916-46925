import { renderHook, act } from '@testing-library/react';
import { useApod } from '../hooks/useApod';

const mockToday = {
  date: '2024-01-01',
  title: 'Test APOD',
  explanation: 'Hello',
  url: 'http://example.com/img.jpg',
  media_type: 'image',
};

jest.mock('../services/apiClient', () => ({
  fetchApodToday: jest.fn(async () => mockToday),
  fetchApodByDate: jest.fn(async () => mockToday),
}));

test('useApod loads today and exposes data', async () => {
  const { result } = renderHook(() => useApod(undefined));
  expect(result.current.loading).toBe(true);

  await act(async () => {
    await result.current.refetch();
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.data?.title).toBe('Test APOD');
  expect(result.current.error).toBeNull();
});
