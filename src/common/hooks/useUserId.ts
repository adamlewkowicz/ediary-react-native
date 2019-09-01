import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { UserId } from '../../types';
import { UserIdCannotBeNullError } from '../error';

export function useUserId(): UserId {
  const userId = useSelector<StoreState, UserId | null>(
    state => state.user.data && state.user.data.id
  );
  if (userId === null) {
    throw new UserIdCannotBeNullError(
      'User id cannot be null. This hook has been called in wrong place, ' +
      'or it has been called before app initialization.'
    );
  }
  return userId;
}