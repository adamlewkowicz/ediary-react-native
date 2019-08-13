import { UserProfileCreated } from '../types';
import { USER_PROFILE_CREATED } from '../../consts';
import { Profile } from '../../../database/entities';

export const userProfileCreated = (
  profile: Profile
): UserProfileCreated => ({
  type: USER_PROFILE_CREATED,
  payload: profile
});