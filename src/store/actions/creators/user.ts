import { UserProfileCreated, UserInitialized } from '../types';
import { USER_PROFILE_CREATED, USER_INITIALIZED } from '../../consts';
import { Profile, User } from '../../../database/entities';

export const userProfileCreated = (
  profile: Profile
): UserProfileCreated => ({
  type: USER_PROFILE_CREATED,
  payload: profile
});

export const userInitialized = (user: User): UserInitialized => ({
  type: USER_INITIALIZED,
  payload: user
});