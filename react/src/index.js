import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppContainer from './AppContainer';
import 'bulma/css/bulma.css';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {authReducer} from './redux/auth';

const store = createStore(
  combineReducers({
    auth: authReducer
  }),
  applyMiddleware(thunk, logger)
);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
