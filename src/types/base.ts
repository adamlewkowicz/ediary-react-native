import {
  MACRO_ELEMENTS,
  BASE_MACRO_ELEMENTS,
  PORTION_TYPES,
  UNIT_TYPES,
} from '../common/consts';
import * as Screens from '../screens';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';

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

export type ApplicationStatus = 'INITIALIZING' | 'CREATING PROFILE' | 'INITIALIZED';

/** Higher order function type for `Array.prototype.filter` method callback. */
export type FilterHOF<T> = (value: T, index: number, values: T[]) => boolean;

export type BaseScreenProps = {
  navigation: NavigationProp<ParamListBase>
  route: RouteProp<Record<string, object>, string>
}