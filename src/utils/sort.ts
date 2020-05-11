import { SortHOF, DayjsTimeBase } from '../types';

export const sortByDateTime: SortHOF<{ timeBase: DayjsTimeBase }> = (a, b) => {
  const timeA = Number(a.timeBase.replace(/:/g, ''));
  const timeB = Number(b.timeBase.replace(/:/g, ''));
  if (timeA === timeB) return 0;
  return timeA > timeB ? 1 : -1;
}

export function sortByMostAccurateName(phrase: string): SortHOF<{ name: string }> {
  const phraseLowered = phrase.toLowerCase();

  return function(a, b) {
    const aNameLowered = a.name.toLowerCase();
    const bNameLowered = b.name.toLowerCase();
  
    const aIndex = aNameLowered.indexOf(phraseLowered);
    const bIndex = bNameLowered.indexOf(phraseLowered);
  
    const notFoundIndex = -1;
    const orderByShorter = aNameLowered.length > bNameLowered.length ? 1 : -1;

    const aNameHasNotBeenFound = aIndex === notFoundIndex;
    const bNameHasNotBeenFound = bIndex === notFoundIndex;
  
    if (aNameHasNotBeenFound && bNameHasNotBeenFound) {
      return 0;
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

export const sortBySmallestDiff = (targetValue: number): SortHOF<number> => (a, b) => {
  const aDiff = targetValue - a;
  const bDiff = targetValue - b;

  if (aDiff === bDiff) return 0;
  if (aDiff > bDiff) return 1;
  else return -1;
}