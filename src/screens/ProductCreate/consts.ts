
export const NUTRITION_INPUTS = [
  {
    title: 'Węglowodany',
    property: 'carbs',
    nextRef: 'prots'
  },
  {
    title: 'Białka',
    property: 'prots',
    nextRef: 'fats'
  },
  {
    title: 'Tłuszcze',
    property: 'fats',
    nextRef: 'kcal'
  },
  {
    title: 'Kalorie',
    property: 'kcal',
    nextRef: 'barcode'
  }
] as const;

export enum PORTION_TITLE {
  '100g' = 'Opakowanie zawiera',
  'portion' = 'Porcja zawiera',
  'package' = 'Opakowanie zawiera'
};