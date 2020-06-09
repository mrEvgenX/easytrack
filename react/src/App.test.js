import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app logo', () => {
  const { getByText } = render(<App />);
  const mainLogo = getByText(/EasyTrack/i);
  expect(mainLogo).toBeInTheDocument();
});
