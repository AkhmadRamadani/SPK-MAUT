import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main page text', () => {
  render(<App />);
  const textElements = screen.getAllByText(/Sistem Pendukung Keputusan/i);
  expect(textElements.length).toBeGreaterThan(0);
});
