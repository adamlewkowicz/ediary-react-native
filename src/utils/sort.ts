import { SortHOF, DayjsTime } from '../types';

export const sortByDateTime: SortHOF<{ time: DayjsTime }> = (a, b) => {
  const timeA = Number(a.time.replace(/:/g, ''));
  const timeB = Number(b.time.replace(/:/g, ''));
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