import {
  MACRO_ELEMENTS,
  BASE_MACRO_ELEMENTS,
  USER_ID_UNSYNCED,
  PORTION_TYPES,
  UNIT_TYPES,
} from './common/consts';
import * as Screens from './screens';

export type UnitType = typeof UNIT_TYPES[number];
export type ProductUnit = 'g' | 'ml';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export type BaseMacroElement = typeof BASE_MACRO_ELEMENTS[number];
export type MacroElement = typeof MACRO_ELEMENTS[number];

export type MacroElements = {
  [key in MacroElement]: number
}

export type BaseMacroElements = {
  [key in BaseMacroElement]: number
}

export interface BarcodeId extends String {};

enum ProductIdBrand {};
export type ProductId = ProductIdBrand & number;

enum MealIdBrand {};
export type MealId = MealIdBrand & number;

enum UserIdBrand {};
export type UserId = UserIdBrand & number;

// proposal type for userId of user
// that has not been synced/registerd in online mode
type UserIdUnsynced = typeof USER_ID_UNSYNCED
type _UserId = UserId | UserIdUnsynced;

export type PortionType = typeof PORTION_TYPES[number];

export type WeightGoal = 'decrease' | 'maintain' | 'increase';

export interface ProfileId extends Number {
  _profileIdBrand: number;
}

export type Screen = keyof typeof Screens | 'Main' | 'AppLoading';

export interface DateDay extends String {
  _dateDayBrand: 'YYYY-MM-DD';
}

export interface DateTime extends String {
  _dateTimeBrand: 'HH:mm:ss'
}

export interface TemplateId extends Number {
  _templateIdBrand: number;
}

export type Environment = 'development' | 'test' | 'production';