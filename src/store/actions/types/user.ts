import { USER_PROFILE_ADDED } from '../../consts';
import { User } from '../../../entities';
import { AppInitialized } from './application';

export type UserProfileAdded = {
  type: typeof USER_PROFILE_ADDED
  payload: {
    user: User
  }
}

export type UserActions = 
  | UserProfileAdded
  | AppInitialized