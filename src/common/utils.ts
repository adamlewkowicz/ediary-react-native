import dayjs from 'dayjs';
import { DateDay, ProductUnit } from '../types';
import { PRODUCT_UNITS } from './consts';

let timeout: NodeJS.Timeout;

export const debounce = (fn: () => void, delay = 150) => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}

export const round = (value: number, scale = 10) => Math.round(value / scale) * scale;

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