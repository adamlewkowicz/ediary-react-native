import { GRADIENT, COLOR } from './color';
import { Z_INDEX } from './z-index';
import { FONT_WEIGHT, FONT_SIZE, FONT_NAME } from './font';
import { SPACING_RAW, SPACING } from './spacing';

export const THEME = {
  fontName: FONT_NAME,
  fontSize: FONT_SIZE,
  fontWeight: FONT_WEIGHT,

  color: COLOR,
  gradient: GRADIENT,

  spacing: SPACING,
  spacingRaw: SPACING_RAW,

  zIndex: Z_INDEX,
} as const;

export type Theme = typeof THEME;
export type ThemeColor = keyof Theme['color'];
export type ThemeFontSize = keyof Theme['fontSize'];