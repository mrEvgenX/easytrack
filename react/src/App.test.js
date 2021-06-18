import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {combineReducers, createStore} from 'redux'
import {Provider} from 'react-redux'
import {authReducer} from './redux/auth'
import {dataReducer} from './redux/data'
import {passwordReducer} from './redux/password'

const store = createStore(
  combineReducers({
    auth: authReducer,
    data: dataReducer,
    password: passwordReducer,
  }),
  {}
);

test('renders app logo', () => {
  const { getByText } = render(  <Provider store={store}><App /></Provider>);
  const mainLogo = getByText(/EasyTrack/i);
  expect(mainLogo).toBeInTheDocument();
});
