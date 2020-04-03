
const FONT_SIZE_V2 = {
  h1: 27,
  h2: 23,
  h3: 18, // 19?
  regular: 14,
  small: 12,
} as const;

export const FONT_SIZE = {
  huge: 25,
  big: 22,
  largeXL: 19,
  large: 16,
  regular: 14,
  small: 12,
  tiny: 11,
  ...FONT_SIZE_V2,
} as const;

export const FONT_WEIGHT = {
  base: 'Hind',
  light: 'Hind-Light',
  regular: 'Hind-Regular',
  medium: 'Hind-Medium',
  bold: 'Hind-Bold',
} as const;

export const FONT_NAME = 'Hind';