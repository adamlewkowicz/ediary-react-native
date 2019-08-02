import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers';
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools';

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunk
    )
  )
);

export type AppState = ReturnType<typeof rootReducer>;