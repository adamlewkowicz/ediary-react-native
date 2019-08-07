import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { UserId } from '../../types';
import { UserIdCannotBeNullError } from '../error';

export function useUserId(): UserId {
  const userId = useSelector<AppState, UserId | null>(
    state => state.user.data && state.user.data.id
  );
  if (userId === null) {
    throw new UserIdCannotBeNullError(
      'User id cannot be null. You must have made something wrong, ' +
      'or userId hook has been called before app initialization.'
    );
  }
  return userId;
}