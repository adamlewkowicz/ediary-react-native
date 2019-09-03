
export const nutritionColors = {
  carbs: ['#5DCF8B', '#C5FFC7'],
  prots: ['#5DB4CF', '#C5FBFF'],
  fats: ['#CFAF5D', '#FFEFC5']
}

export const nutritionColorSolid = {
  carbs: '#8AE4A5',
  prots: '#7BD4E5',
  fats: '#E8CF92',
  kcal: '#E89292',
}

export const themeProps = {
  fontFamily: 'DMSans-Regular',
  focusColor: '#5361E0',
  secondaryColor: '#C7C6CB',
  fontSize: 15,
  colors: {
    lightBlue: '#6BB4DD',
    gray: '#BCBAC6',
  }
}

export type Theme = typeof themeProps;