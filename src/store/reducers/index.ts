import { combineReducers } from 'redux';
import { diaryReducer } from './diary';
import { applicationReducer } from './application';

export const rootReducer = combineReducers({
  application: applicationReducer,
  diary: diaryReducer
});