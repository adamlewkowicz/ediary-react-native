import { useSelector } from 'react-redux';
import { Selectors } from '../store';
import { UserId } from '../types';
import { UserIdCannotBeNullError } from '../common/error';

export function useUserId(): UserId {
  const userId: UserId | null = useSelector(Selectors.getUserId);

  if (userId === null) {
    throw new UserIdCannotBeNullError(
      'User id cannot be null. This hook has been called in wrong place, ' +
      'or it has been called before app initialization.'
    );
  }
  
  return userId;
}