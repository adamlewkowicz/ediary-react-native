/// <reference lib="dom" />
import dayjs from 'dayjs';
import { DateDay, UnitType, DateTime, MacroElements, BaseMacroElements, ObjectEntries } from '../../types';
import { UNIT_TYPES, DATE_TIME, DATE_DAY, MACRO_ELEMENTS, KCAL_IN_ONE_MACRO_GRAM } from '../consts';
import { LayoutAnimation } from 'react-native';

export const debounce = () => {
  let timeout: NodeJS.Timeout;
  return (callback: () => void, delay = 250) => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  }
}

export const round = (value: number, scale = 10) => Math.round(value * scale) / scale;

export const toLocaleString = (value: number) => new Intl.NumberFormat('pl-PL').format(value);

/**
 * Maps over an array and runs promise returned from a callback in a sequence.
 * @param items array of elements to iterate on
 * @param callback callback that is executed on each iteration
 */
export const mapAsyncSequence = async <T, R>(
  items: T[],
  callback: (item: T) => Promise<R>
) => {
  const result: R[] = [];

  for (const item of items) {
    const resultItem = await callback(item);
    result.push(resultItem);
  }

  return result;
}

export function getDayFromDate(
  date: dayjs.ConfigType
): DateDay {
  const dateDay: DateDay = dayjs(date).format(DATE_DAY) as any;
  return dateDay;
}

export function getTimeFromDate(
  date: dayjs.ConfigType
) {
  const dateTime: DateTime = dayjs(date).format(DATE_TIME) as any;
  return dateTime;
}

export function getValAndUnitFromString(value: string): {
  value: number | null
  unit: UnitType | null
} {
  const unit = UNIT_TYPES.find(unit => value.includes(unit));
  const parsedValue = parseFloat(
    value.replace(/,/, '.')
  );
  const result = Number.isNaN(parsedValue) ? null : parsedValue; 

  return {
    unit: unit || null,
    value: result || null
  }
}

export function sortByMostAccurateName(
  phrase: string
) {
  const phraseLowered = phrase.toLowerCase();

  return function<T extends { name: string }>(
    a: T,
    b: T
  ): -1 | 0 | 1 {
    const aNameLowered = a.name.toLowerCase();
    const bNameLowered = b.name.toLowerCase();
  
    const aIndex = aNameLowered.indexOf(phraseLowered);
    const bIndex = bNameLowered.indexOf(phraseLowered);
  
    const notFoundIndex = -1;
    const orderByShorter = aNameLowered.length > bNameLowered.length ? 1 : -1;

    const aNameHasNotBeenFound = aIndex === notFoundIndex;
    const bNameHasNotBeenFound = bIndex === notFoundIndex;
  
    if (aNameHasNotBeenFound && bNameHasNotBeenFound) {
      return -1;
    }
    if (aNameHasNotBeenFound) {
      return 1;
    }
    if (bNameHasNotBeenFound) {
      return -1;
    }
  
    if (aNameLowered.length === bNameLowered.length) {
      return 0;
    }
  
    return orderByShorter;
  }
}

export function getNumAndUnitFromString(value: string): {
  value: number | null
  unit: UnitType | null
} {
  const parseToNumber = (val: string): number | null => {
    const parsed = val.trim().replace(/,/, '.')
    const numbers = parsed.match(/[+-]?\d+(\.\d+)?/g);

    if (!numbers) {
      return null;
    }
    const result = parseFloat(numbers[numbers.length - 1]);

    if (Number.isNaN(result)) {
      return null;
    }
    return result;
  }

  const unit = UNIT_TYPES.find(unit => value.includes(` ${unit}`)) || null;
  const result = parseToNumber(value);

  return {
    value: result,
    unit
  }
}

export const filterByUniqueProperty = <
  E extends object,
  A extends E[]
>(property: keyof E) => (element: E, index: number, self: A): boolean => {
  const foundIndex = self.findIndex(anyElement =>
    anyElement[property] === element[property]
  );
  return foundIndex === index;
}

export const filterByUniqueId = filterByUniqueProperty('id');

export function parseNumber(
  value: string,
  maxNumber?: number,
  maxLength?: number,
): string {
  const trimmed = maxLength ? value.substring(0, maxLength) : value;
  const cleaned = trimmed.replace(/[^\d.-]/g, '');
  const parsed = Number(cleaned);

  if (maxNumber && parsed >= maxNumber) {
    return cleaned.slice(0, -1);
  }

  return cleaned;
}

export function findOrFail<T>(
  array: T[],
  matcher: (item: T, index: number, self: T[]) => boolean
): T {
  const foundItem = array.find(matcher);
  if (!foundItem) {
    throw new Error(
      '[findOrFail] - No item could be found for specified criteria'
    );
  }
  return foundItem;
}

const createArrayOfLength = <T>(
  length: number,
  callback: (index: number) => T
): T[] => Array.from({ length }, (_, index) => callback(index));

export const fillArrayWithinRange = (
  { from, to }: { from: number; to: number }
): number[] => {
  const zeroBasedCountFill = 1;
  const length = to - from + zeroBasedCountFill;
  return createArrayOfLength(length, index => index + from);
}

export const fetchify = async <T>(
  input: RequestInfo,
  init: RequestInit = {},
  controller = new AbortController()
): Promise<T> => {
  const { signal } = controller;

  const response = await fetch(input, { signal, ...init });
  const json: T = await response.json();

  return json;
}

export const objectMap = <
  T extends object,
  Property extends keyof T = keyof T,
  Value = T[Property]
>(
  obj: T,
  callback: (property: Property, value: Value) => Value
): T => {
  return Object.fromEntries(
    Object
      .entries(obj)
      .map(([property, value]) => [property, callback(property as Property, value)])
  ) as T;
}

const objectEntries: ObjectEntries = Object.entries;

export const calculateCaloriesByMacro = (
  macro: BaseMacroElements
): number => {
  return objectEntries(macro)
    .reduce(
      (kcal, [macroName, macroQuantity]) => kcal += macroQuantity * KCAL_IN_ONE_MACRO_GRAM[macroName],
      0
    );
}

export const layoutAnimateEase = (onAnimationDidEnd?: () => void) => {
  LayoutAnimation.configureNext(
    LayoutAnimation.Presets.easeInEaseOut,
    onAnimationDidEnd
  );
}

export const calculatePercentage = (portion: number, total: number): number => {
  if (total === 0) return 0;
  return Math.floor(portion / total * 100);
}

export const calculateMacroPerQuantity = <T extends MacroElements>(
  macroValuesPerHundredQuantity: T,
  quantity: number
): T => objectMap(
  macroValuesPerHundredQuantity,
  (_, macroValue: number) => round(macroValue * quantity / 100, 100)
);

export const calculateMacroPercentages = <T extends BaseMacroElements>(
  macroValues: T
): BaseMacroElements => {
  const macroSum = macroValues.carbs + macroValues.prots + macroValues.fats;

  const carbs = calculatePercentage(macroValues.carbs, macroSum);
  const prots = calculatePercentage(macroValues.prots, macroSum);
  const fats = calculatePercentage(macroValues.fats, macroSum);

  return { carbs, prots, fats };
}

const calculateMacroValueNeed = (
  eaten: number,
  needed: number
): MacroNeed => ({
  eaten,
  needed,
  left: needed - eaten,
  percentage: calculatePercentage(eaten, needed),
});

export const calculateMacroNeeds = <T extends object>(
  macroValuesEaten: T,
  macroValuesNeeded: T
): { [key: string]: MacroNeed } => objectMap(
  macroValuesEaten,
  (macroName, macroValueEaten) => {
    // TODO: refactor types
    const macroValueNeeded = macroValuesNeeded[macroName] as any as number;

    const macroValueNeed = calculateMacroValueNeed(
      macroValueEaten,
      macroValueNeeded
    );

    return macroValueNeed;
  }
);

type MacroNeed = {
  eaten: number
  needed: number
  left: number,
  percentage: number
}

const calculateObjectsValueSum = <T extends { [key: string]: number }>(
  objects: T[],
  initialObj: T = objects[0],
): T => {
  return objects.reduce<T>((acc, current) => {
    const next = { ...acc };

    for (const key in next) {
      // @ts-ignore
      next[key] += current[key];
    }

    return next;
  }, { ...initialObj });
}