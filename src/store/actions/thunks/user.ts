import { Profile } from '../../../entities';
import { getCustomRepository } from 'typeorm/browser';
import { UserRepository } from '../../../repositories/UserRepository';
import { AppState } from '../..';
import { userProfileCreated } from '../creators/user';

export const userProfileCreate = (
  profile: Omit<Profile, 'id' | 'macroNeeds' | 'user' | 'measureMacroNeeds' | 'userId'>
) => async (dispatch: any, getState: () => AppState) => {
  const userData = getState().user.data;
  if (!userData) return;

  const createdProfile = await getCustomRepository(UserRepository)
    .createProfile(userData.id, profile);

  dispatch(
    userProfileCreated(createdProfile)
  );
}