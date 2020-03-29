import { StoreState } from '..';
import { UserId } from '../../types';

export const getUserMacroNeeds = (state: StoreState) => state.user.macroNeeds;

export const getUserId = (state: StoreState): UserId | null => state.user.data?.id ?? null;