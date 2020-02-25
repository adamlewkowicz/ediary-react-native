import { User, IProfileRequired } from '../../../database/entities';
import { Thunk } from '../..';
import { userProfileCreated } from '../creators';

export const userProfileCreate: Thunk = (
  profile: IProfileRequired
) => async (dispatch) => {
  const { userId, ...data } = profile;
  const createdProfile = await User.createProfile(userId, data);

  dispatch(
    userProfileCreated(createdProfile)
  );
}