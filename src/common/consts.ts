import { Environment, MacroElements } from '../types';

export const DEFAULT_CONNECTION: 'default' = 'default';

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
export const DAYJS_DATETIME_BASE = 'HH:mm' as const;
export const DATE_TIME = 'HH:mm:ss' as const;
export const DATE_FORMAT = `${DATE_DAY} ${DATE_TIME}`;

export const ABORT_ERROR_NAME = 'AbortError' as const;

export const MACRO: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

export enum KCAL_IN_ONE_MACRO_GRAM {
  carbs = 4,
  prots = 4,
  fats = 9
}