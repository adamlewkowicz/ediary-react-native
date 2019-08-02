export const PRODUCT_UNITS = ['g', 'mg', 'kg', 'ml', 'l'] as const;
export const BASE_MACRO_ELEMENTS = ['carbs', 'prots', 'fats'] as const
export const MACRO_ELEMENTS = [...BASE_MACRO_ELEMENTS, 'kcal'] as const;
// proposal
export const USER_ID_UNSYNCED = 0 as const;