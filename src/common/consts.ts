import { Environment } from '../types';

export const PRODUCT_UNITS = ['g', 'mg', 'kg', 'ml', 'l'] as const;
export const BASE_MACRO_ELEMENTS = ['carbs', 'prots', 'fats'] as const
export const MACRO_ELEMENTS = [...BASE_MACRO_ELEMENTS, 'kcal'] as const;
// proposal
export const USER_ID_UNSYNCED = 0 as const;
export const PORTION_TYPES = [
  'portion', 'package',  'piece', 'slice', 'spoon', 'handful', 'glass'
] as const;

export const WEIGHT_GOAL = ['decrease', 'maintain', 'increase'] as const;

export const IS_DEV = __DEV__;

export const APP_ENV = (process.env.APP_ENV || 'development') as Environment;