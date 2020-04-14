import { KnownPortionMap, PortionType } from './types';

export const KNOWN_PORTION_MAP: KnownPortionMap = {
  'garsc': 'handful',
  'kromka': 'slice',
  'lyzka': 'spoon',
  'porcja': 'portion',
  'szklanka': 'glass',
  'sztuka': 'piece'
} as const;

export const KNOWN_PORTION_TYPES = Object.keys(KNOWN_PORTION_MAP) as PortionType[];