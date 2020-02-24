import { StoreState } from '..';

export const getMacroNeeds = (state: StoreState) => state.user.macroNeeds;

export type GetMacroNeeds = ReturnType<typeof getMacroNeeds>;