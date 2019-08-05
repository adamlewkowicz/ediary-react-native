import { WeightGoal } from '../../types';

export const formulaRatio: FormulaRatio = {
  decrease: { carbs: 2.2, prots: 2.6, fats: 0.45 },
  maintain: { carbs: 3.5, prots: 2.2, fats: 0.8 },
  increase: { carbs: 4.4, prots: 2.2, fats: 0.9 }
}

/** Calories in one gram of carbs, prots and fats */
export const kcalRatio = {
  carbs: 4,
  prots: 4,
  fats: 9
}

type FormulaRatio = {
  [key in WeightGoal]: {
    carbs: number
    prots: number
    fats: number
  }
}