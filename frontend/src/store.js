import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middlewares = [thunk];

const devTools = process.env.NODE_ENV === "production" ? applyMiddleware(...middlewares) : composeWithDevTools(applyMiddleware(...middlewares));

const store = createStore(
  rootReducer,
  initialState,
  devTools
);

export default store;