import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import {combineReducers, createStore} from 'redux'
import {Provider} from 'react-redux'
import {authReducer} from '../redux/auth'
import {dataReducer} from '../redux/data'
import {passwordReducer} from '../redux/password'
import Main from './Main';


const store = createStore(
  combineReducers({
    auth: authReducer,
    data: dataReducer,
    password: passwordReducer,
  }),
  {}
);



test('renders "all" filter button', () => {
//  const { getByText } = render(
//    <BrowserRouter>
//      <Provider store={store}>
//      <Main
//        trackedItems={[]}
//        trackEntries={[]}
//        populateStateIfNecessary={() => {}} />
//      </Provider>
//    </BrowserRouter>
//  );
//  const allFilterButton = getByText(/Придумайте имя/i);
//  expect(allFilterButton).toBeInTheDocument();
});
