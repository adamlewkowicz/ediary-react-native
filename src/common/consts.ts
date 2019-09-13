import { Environment } from '../types';

export const UNIT_TYPES = ['g', 'mg', 'kg', 'ml', 'l'] as const;
export const PRODUCT_UNITS = ['g', 'ml'] as const;
export const BASE_MACRO_ELEMENTS = ['carbs', 'prots', 'fats'] as const
export const MACRO_ELEMENTS = [...BASE_MACRO_ELEMENTS, 'kcal'] as const;

export const USER_ID_UNSYNCED = 0 as const;

export const PORTION_TYPES = [
  'portion', 'package',  'piece', 'slice', 'spoon', 'handful', 'glass'
] as const;

export const WEIGHT_GOAL = ['decrease', 'maintain', 'increase'] as const;

export const IS_DEV: boolean = (global as any).__DEV__;
export const APP_ENV = (process.env.APP_ENV || 'development') as Environment;

export const DATE_DAY = 'YYYY-MM-DD';
export const DATE_TIME = 'HH:mm:ss';
export const DATE_FORMAT = `${DATE_DAY} ${DATE_TIME}`;