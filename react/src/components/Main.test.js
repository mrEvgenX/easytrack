import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Main from './Main';

test('renders "all" filter button', () => {
  const { getByText } = render(
    <BrowserRouter>
      <Main
        trackedItems={[]}
        trackEntries={[]}
        populateStateIfNecessary={() => {}} />
    </BrowserRouter>
  );
  const allFilterButton = getByText(/Придумайте имя/i);
  expect(allFilterButton).toBeInTheDocument();
});
