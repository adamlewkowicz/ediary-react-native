import { USER_PROFILE_CREATED } from '../../consts';
import { Profile } from '../../../database/entities';
import { AppInitialized } from './application';

export type UserProfileCreated = {
  type: typeof USER_PROFILE_CREATED
  payload: Profile
}

export type UserActions = 
  | AppInitialized
  | UserProfileCreated