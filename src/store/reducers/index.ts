import { combineReducers } from 'redux';
import { diaryReducer } from './diary';
import { applicationReducer } from './application';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  application: applicationReducer,
  diary: diaryReducer,
  user: userReducer
});