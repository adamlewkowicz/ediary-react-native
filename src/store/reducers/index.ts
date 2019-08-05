import { combineReducers } from 'redux';
import { diaryReducer } from './diary';
import { applicationReducer } from './application';
import { measurementsReducer } from './measurements';

export const rootReducer = combineReducers({
  application: applicationReducer,
  diary: diaryReducer,
  measurements: measurementsReducer
});