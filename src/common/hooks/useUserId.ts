import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { UserId } from '../../types';

export function useUserId(): UserId | null {
  const userId = useSelector<AppState, UserId | null>(
    state => state.user.data && state.user.data.id
  );
  return userId;
}