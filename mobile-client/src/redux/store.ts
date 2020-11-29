import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

// Create an interface for the application state
export interface IAppState {
  authState: IAuthState
}

// Create a configure store function
export default function configureStore(): Store<IAppState, any> {
  return createStore(rootReducer, undefined, applyMiddleware(thunk));
}