import {
  MACRO_ELEMENTS,
  BASE_MACRO_ELEMENTS,
  PORTION_TYPES,
  UNIT_TYPES,
} from '../common/consts';
import * as Screens from '../screens';

export type UnitType = typeof UNIT_TYPES[number];
export type ProductUnit = 'g' | 'ml';

export type BaseMacroElement = typeof BASE_MACRO_ELEMENTS[number];
export type MacroElement = typeof MACRO_ELEMENTS[number];

export type MacroElements = {
  [key in MacroElement]: number
}

export type BaseMacroElements = {
  [key in BaseMacroElement]: number
}

export type PortionType = typeof PORTION_TYPES[number];

export type WeightGoal = 'decrease' | 'maintain' | 'increase';

export type Screen = keyof typeof Screens | 'Main' | 'AppLoading';

export type Environment = 'development' | 'test' | 'production';

export interface NavigationScreenProps<N, R = unknown> {
  navigation: N
  route: R
}