import dayjs from 'dayjs';
import { DateDay, UnitType, DateTime, MacroElements } from '../../types';
import { UNIT_TYPES, DATE_TIME, DATE_DAY, MACRO_ELEMENTS } from '../consts';

let timeout: NodeJS.Timeout;

export const debounce_ = () => {
  let timeout: NodeJS.Timeout;
  return (fn: () => void, delay = 250) => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  }
}

export const debounce = (fn: () => void, delay = 150) => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}

export const round = (value: number, scale = 10) => Math.round(value * scale) / scale;

export const toLocaleString = (value: number) => new Intl.NumberFormat('pl-PL').format(value);

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
    const aLowered = a.name.toLowerCase();
    const bLowered = b.name.toLowerCase();
  
    const aIndex = aLowered.indexOf(phraseLowered);
    const bIndex = bLowered.indexOf(phraseLowered);
  
    const notFoundIndex = -1;
    const orderByShorter = aLowered.length > bLowered.length ? 1 : -1;
  
    if (aIndex === notFoundIndex && bIndex === notFoundIndex) {
      return -1;
    }
    if (aIndex === notFoundIndex) {
      return 1;
    }
    if (bIndex === notFoundIndex) {
      return -1;
    }
  
    if (aLowered.length === bLowered.length) {
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

export function filterByUniqueId<T extends { id: number | string }>(
  item: T,
  index: number,
  self: T[]
): boolean {
  const foundIndex = self.findIndex(anyItem => anyItem.id === item.id);
  return foundIndex === index;
}

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

export function calcMacroNeedsLeft(
  macroEaten: MacroElements,
  macroNeeds: MacroElements
) {
  const macroNeedsElement = { diff: 0, ratio: 0, eaten: 0, needed: 0 };

  return MACRO_ELEMENTS.reduce((result, element) => {
    const diff = Math.round(macroNeeds[element] - macroEaten[element]);
    const ratio = Math.floor(
      macroEaten[element] / macroNeeds[element] * 100
    );
    return {
      ...result,
      [element]: {
        diff,
        ratio,
        eaten: macroEaten[element],
        needed: macroNeeds[element]
      }
    }
  }, {
    carbs: { ...macroNeedsElement },
    prots: { ...macroNeedsElement },
    fats: { ...macroNeedsElement },
    kcal: { ...macroNeedsElement }
  });
}