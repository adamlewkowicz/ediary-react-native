import { Profile } from '../../../database/entities';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../../database/repositories/UserRepository';
import { Thunk } from '../..';
import { userProfileCreated } from '../creators/user';
import { Omit } from 'yargs';

export const userProfileCreate = (
  profile: Omit<Profile, 'id' | 'macroNeeds' | 'user' | 'measureMacroNeeds' | 'userId'>
): Thunk => async (dispatch, getState) => {
  const userData = getState().user.data;
  if (!userData) return;

  const createdProfile = await getCustomRepository(UserRepository)
    .createProfile(userData.id, profile);

  dispatch(
    userProfileCreated(createdProfile)
  );
}