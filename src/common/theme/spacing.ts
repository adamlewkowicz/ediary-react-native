
const SPACING_BASE = {
  micro: '4px',
  tiny: '8px',
  small: '16px',
  base: '24px',
  large: '48px',
  xLarge: '64px',
} as const;

const SPACING_HELPERS = {
  microXSmall: '4px 16px',

  tinyVertical: '8px 0px',
  tinyHorizontal: '0px 8px',

  smallVertical: '16px 0px',
  smallHorizontal: '0px 16px',
  smallXBaseVertical: '16px 0 24px 0',
  smallXMicroVertical: '16px 0px 4px 0px',

  baseXSmall: '24px 16px',
  baseVertical: '24px 0',

  largeHorizontal: '0 48px',

} as const;

export const SPACING = {
  ...SPACING_HELPERS,
  ...SPACING_BASE,
};

export const SPACING_RAW = {
  micro: 4,
  tiny: 8,
  small: 16,
  base: 24,
  large: 48,
  xLarge: 64,
} as const;