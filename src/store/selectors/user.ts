import { StoreState } from '..';
import { UserId } from '../../types';

export const getMacroNeeds = (state: StoreState) => state.user.macroNeeds;

export const getUserId = (state: StoreState): UserId | null => state.user.data?.id ?? null;

export type GetMacroNeeds = ReturnType<typeof getMacroNeeds>;