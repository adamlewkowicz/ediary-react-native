import {
  PRODUCT_UNITS,
  MACRO_ELEMENTS,
  BASE_MACRO_ELEMENTS,
  USER_ID_UNSYNCED,
  PORTION_TYPES
} from './common/consts';

export type ProductUnit = typeof PRODUCT_UNITS[number];

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