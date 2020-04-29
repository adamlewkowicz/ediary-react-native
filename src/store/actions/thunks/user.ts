import { User, IProfileRequired } from '../../../database/entities';
import { Thunk } from '../..';
import { userProfileCreated, userInitialized } from '../creators';
import { USER_ID_UNSYNCED } from '../../../common/consts';

export const userInitialize = (): Thunk<Promise<void>> => async (dispatch) => {
  const user = await User.getOrCreate({
    id: USER_ID_UNSYNCED,
    email: null,
    login: 'login',
    password: 'password',
  });

  dispatch(userInitialized(user));
}

export const userProfileCreate = (
  profile: IProfileRequired
): Thunk<Promise<void>> => async (dispatch) => {
  const { userId, ...data } = profile;
  const createdProfile = await User.createProfile(userId, data);

  dispatch(
    userProfileCreated(createdProfile)
  );
}