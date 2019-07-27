import { combineReducers } from 'redux';
import { diaryReducer } from './diary';

export const rootReducer = combineReducers({
  diary: diaryReducer
});