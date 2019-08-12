import dayjs from 'dayjs';
import { DateDay, ProductUnit } from '../types';
import { PRODUCT_UNITS } from './consts';

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
  const dateDay: DateDay = dayjs(date).format('YYYY-MM-DD') as any;
  return dateDay;
}


export function getValAndUnitFromString(value: string): {
  value: number | null
  unit: ProductUnit | null
} {
  const unit = PRODUCT_UNITS.find(unit => value.includes(unit));
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

  return function<T extends SortByName>(
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

interface SortByName {
  name: string
}

export function getNumAndUnitFromString(value: string): {
  value: number | null
  unit: ProductUnit | null
} {
  const parseToNumber = (val: string): number | null => {
    const result = parseFloat(
      val.trim().replace(/,/, '.')
    );
    if (Number.isNaN(result)) {
      return null;
    }
    return result;
  }
  const unit = PRODUCT_UNITS.find(unit => value.includes(unit)) || null;
  const manyValues = value.split('/');

  if (manyValues.length > 1) {
    const result = parseToNumber(manyValues[manyValues.length - 1]);
    return {
      value: result,
      unit
    }
  }
  const result = parseToNumber(manyValues[0]);

  return {
    value: result,
    unit
  }
}