import { USER_PROFILE_CREATED, USER_INITIALIZED } from '../../consts';
import { Profile, User } from '../../../database/entities';

export const userProfileCreated = (profile: Profile) => ({
  type: USER_PROFILE_CREATED,
  payload: profile
});

export const userInitialized = (user: User) => ({
  type: USER_INITIALIZED,
  payload: user
});


export type UserAction = 
  | ReturnType<typeof userProfileCreated>
  | ReturnType<typeof userInitialized>