import { StoreState } from '..';
import { UserId } from '../../types';
import { UserState } from '../reducers/user';

export const getUserMacroNeeds = (state: StoreState) => state.user.macroNeeds;

export const getUserId = (state: StoreState): UserId | null => state.user.data?.id ?? null;

export const getUser = (state: StoreState): UserState => state.user;