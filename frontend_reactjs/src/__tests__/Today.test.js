import { render, screen } from '@testing-library/react';
import Today from '../pages/Today';

jest.mock('../hooks/useApod', () => ({
  useApod: () => ({
    data: {
      date: '2024-01-01',
      title: 'Mock Today',
      explanation: 'Mock explanation',
      url: 'http://example.com',
      media_type: 'image',
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

test('renders Today page heading', () => {
  render(<Today />);
  expect(screen.getByRole('heading', { level: 1, name: /today/i })).toBeInTheDocument();
});
