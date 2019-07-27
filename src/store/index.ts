import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers';
import thunk from 'redux-thunk'
import { connectionManager } from '../database/manager';

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk.withExtraArgument(connectionManager)
  )
);

export type AppState = ReturnType<typeof rootReducer>;