import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers';
import thunk from 'redux-thunk'
import { connectionManager } from '../database/manager';
import { composeWithDevTools } from 'remote-redux-devtools';

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunk.withExtraArgument(connectionManager)
    )
  )
);

export type AppState = ReturnType<typeof rootReducer>;