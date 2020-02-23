import { USER_PROFILE_CREATED, USER_INITIALIZED } from '../../consts';
import { Profile, User } from '../../../database/entities';

export type UserProfileCreated = {
  type: typeof USER_PROFILE_CREATED
  payload: Profile
}

export type UserInitialized = {
  type: typeof USER_INITIALIZED
  payload: User
}

export type UserActions = 
  | UserProfileCreated
  | UserInitialized