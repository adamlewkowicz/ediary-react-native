import { combineReducers } from 'redux';
import { diaryReducer } from './diary';
import { applicationReducer } from './application';
import { userReducer } from './user';
import { productHistoryReducer } from './productHistory';
import { runningTrainingReducer } from './runningTraining';

export const rootReducer = combineReducers({
  application: applicationReducer,
  diary: diaryReducer,
  user: userReducer,
  productHistory: productHistoryReducer,
  runningTraining: runningTrainingReducer,
});