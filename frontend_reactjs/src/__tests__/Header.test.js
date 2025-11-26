import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('renders navigation links', () => {
  render(<Header />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /today/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /archive/i })).toBeInTheDocument();
});
