import { User, IProfileRequired } from '../../../database/entities';
import { Thunk } from '../..';
import { userProfileCreated } from '../creators';

export const userProfileCreate = (
  profile: IProfileRequired
): Thunk<Promise<void>> => async (dispatch) => {
  const { userId, ...data } = profile;
  const createdProfile = await User.createProfile(userId, data);

  dispatch(
    userProfileCreated(createdProfile)
  );
}