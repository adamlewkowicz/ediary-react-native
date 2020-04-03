
export const COLOR_V2 = {
  primary: '#26367A',
  primaryLight: '#FFFFFF',
  secondary: '#B5BACC',
  tertiary: '#E1E5F5',
  quaternary: '#F3F5FC',
  quinary: '#f7f9ff',

  highlight: '#3F71FF',
  highlightSecondary: '#6BB4DD',

  success: '#2DD266',
  error: '#FF7979',
} as const;

export const COLOR = {
  focus: '#5361E0',
  secondary: '#C7C6CB',
  
  carbs: '#8AE4A5',
  prots: '#7BD4E5',
  fats: '#E8CF92',
  kcal: '#E89292',

  blue10: '#f7fdff',
  blue20: '#ebf8fe',
  blue30: '#6BB4DD',

  gray10: '#f1f0f5',
  gray20: '#cdcbd6',
  gray30: '#BCBAC6',
  gray40: '#646464',

  dark10: '#353344',
  dark20: '#313131',

  /** @deprecated color names */
  lightBlue: '#6BB4DD',
  lighterBlue: '#f7fdff',
  gray: '#BCBAC6',
  lightGray: '#f1f0f5',
  midGray: '#cdcbd6',

  ...COLOR_V2,
} as const;

export const GRADIENT = {
  carbs: ['#5DCF8B', '#C5FFC7'],
  prots: ['#5DB4CF', '#C5FBFF'],
  fats: ['#CFAF5D', '#FFEFC5'],
  kcal: ['#C0FDCA', '#61C4D1'],
} as const;