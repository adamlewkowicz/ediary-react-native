import { Environment, MacroElements } from '../types';

export const DEFAULT_CONNECTION = 'default';

export const UNIT_TYPES = ['g', 'mg', 'kg', 'ml', 'l'] as const;
export const PRODUCT_UNIT_TYPE = ['g', 'ml'] as const;

export const PRODUCT_PORTION_TYPE = [
  'portion', 'package',  'piece', 'slice', 'spoon', 'handful', 'glass'
] as const;

export const BASE_MACRO_ELEMENTS = ['carbs', 'prots', 'fats'] as const
export const MACRO_ELEMENTS = [...BASE_MACRO_ELEMENTS, 'kcal'] as const;

export const USER_ID_UNSYNCED = 0;

export const WEIGHT_GOAL = ['decrease', 'maintain', 'increase'] as const;

export const IS_DEV: boolean = __DEV__;
export const APP_ENV = (process.env.APP_ENV ?? 'development') as Environment;

export const DAYJS_DATE = 'YYYY-MM-DD';
export const DAYJS_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const DAYJS_TIME = 'HH:mm:ss';
export const DAYJS_TIME_BASE = 'HH:mm';

export const ABORT_ERROR_NAME = 'AbortError';

export const MACRO: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

export enum KCAL_PER_MACRO_GRAM {
  carbs = 4,
  prots = 4,
  fats = 9
}

export const FORMULA_RATIO_BY_WEIGHT_GOAL = {
  decrease: { carbs: 2.2, prots: 2.6, fats: 0.45 },
  maintain: { carbs: 3.5, prots: 2.2, fats: 0.8 },
  increase: { carbs: 4.4, prots: 2.2, fats: 0.9 }
} as const;