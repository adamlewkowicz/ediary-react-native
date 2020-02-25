import { createStore, applyMiddleware, Store, Action, ActionCreator } from 'redux';
import { rootReducer } from './reducers';
import thunk, { ThunkAction } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Actions from './actions';
import * as Selectors from './selectors';

export function configureStore(
  initialState?: Partial<StoreState>
): Store<StoreState> {

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
    module.hot.accept(() => {
      // eslint-disable-next-line
      const { rootReducer } = require('./reducers');
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}

export const store = configureStore();

export type StoreState = ReturnType<typeof rootReducer>;
export { StoreState as AppState };

type _ThunkAction<R = Promise<void>, A extends Action = Action<string>> = ThunkAction<R, StoreState, void, A>;

export type Thunk<R = Promise<void>, A extends Action = Action<string>> = ActionCreator<
  _ThunkAction<R, A>
>;
export interface DispatchProp  {
  dispatch: Dispatch
}

interface Dispatch {
  <R>(action: _ThunkAction<R>): R
  <A extends Action>(action: A): A
}

export { Actions };
export { Selectors };