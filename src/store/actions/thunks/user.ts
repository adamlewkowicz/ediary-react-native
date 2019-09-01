import { User, IProfileRequired } from '../../../database/entities';
import { Thunk } from '../..';
import { userProfileCreated } from '../creators/user';

export const userProfileCreate = (
  profile: IProfileRequired
): Thunk => async (dispatch) => {
  const { userId, ...data } = profile;
  const createdProfile = await User.createProfile(userId, data);

  dispatch(
    userProfileCreated(createdProfile)
  );
}