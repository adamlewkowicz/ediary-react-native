import {
  MACRO_ELEMENTS,
  BASE_MACRO_ELEMENTS,
  PRODUCT_PORTION_TYPE,
  UNIT_TYPES,
  PRODUCT_UNIT_TYPE,
} from '../common/consts';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { BarcodeId } from './nominal';

export type UnitType = typeof UNIT_TYPES[number];
export type ProductUnitType = typeof PRODUCT_UNIT_TYPE[number];

export type BaseMacroElement = typeof BASE_MACRO_ELEMENTS[number];
export type MacroElement = typeof MACRO_ELEMENTS[number];

export type BaseMacroElements<T = number> = {
  carbs: T
  prots: T
  fats: T
}

export type MacroElements<T = number> = {
  carbs: T
  prots: T
  fats: T
  kcal: T
}

export type ProductPortionType = typeof PRODUCT_PORTION_TYPE[number];

export type WeightGoal = 'decrease' | 'maintain' | 'increase';

export type Environment = 'development' | 'test' | 'production';

export type ApplicationStatus = 'INITIALIZING' | 'CREATING PROFILE' | 'INITIALIZED';

/** Higher order function type for `Array.prototype.filter` method callback. */
export type FilterHOF<T> = (value: T, index: number, values: T[]) => boolean;

export type SortHOF<T> = (itemA: T, itemB: T) => -1 | 0 | 1;

export type BaseScreenProps = {
  navigation: NavigationProp<ParamListBase>
  route: RouteProp<Record<string, object>, string>
}

export type ObjectNumeric = {
  [key: string]: number
}

export type ObjectEntries = <
  T extends object,
  Property extends keyof T = keyof T,
  Value = T[Property]
>(object: T) => [Property, Value][];

export type NormalizedPortion = {
  type: ProductPortionType
  unit: ProductUnitType
  value: number
}

export type NormalizedPortions = NormalizedPortion[]

export interface NormalizedProduct {
  _id: string | number
  name: string
  portion: number
  brand?: string
  macro: {
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
  portions: NormalizedPortions
  unit?: ProductUnitType | null
  images?: string[]
  barcode?: BarcodeId
  producer?: string
  description?: string
  ingredients?: string[]
}