import { createStore, applyMiddleware, Store } from 'redux';
import { rootReducer } from './reducers';
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools';

export function configureStore(initialState?: Partial<AppState>): Store<AppState> {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        thunk
      )
    )
  );

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const { rootReducer } = require('./reducers');
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}

export type AppState = ReturnType<typeof rootReducer>;