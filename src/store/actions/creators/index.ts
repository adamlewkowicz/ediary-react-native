import { ActionType } from '../../store';

import * as applicationActions from './application';
import * as diaryActions from './diary';
import * as userActions from './user';
import * as productHistoryActions from './productHistory';

export type ApplicationAction = ActionType<typeof applicationActions>;
export type DiaryAction = ActionType<typeof diaryActions>;
export type UserAction = ActionType<typeof userActions>;
export type ProductHistoryAction = ActionType<typeof productHistoryActions>;

export * from './diary';
export * from './application';
export * from './user';
export * from './productHistory';