import { PortionMap } from './types';

export const PORTION_MAP: PortionMap = {
  'garsc': 'handful',
  'kromka': 'slice',
  'lyzka': 'spoon',
  'porcja': 'portion',
  'szklanka': 'glass',
  'sztuka': 'piece'
} as const;

export const KNOWN_PORTION_TYPES = Object.keys(PORTION_MAP);