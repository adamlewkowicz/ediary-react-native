import { Profile } from '../../entities';
import { MacroElements, WeightGoal } from '../../types';

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

export function measureMacroNeeds(
  measureData: Pick<Profile, 'weightGoal' | 'weight'>
): MacroElements {
  const ratio = formulaRatio[measureData.weightGoal];

  const carbs = Math.round(ratio.carbs * measureData.weight);
  const prots = Math.round(ratio.prots * measureData.weight);
  const fats = Math.round(ratio.fats * measureData.weight);
  const kcal = Math.round(
    kcalRatio.carbs * carbs +
    kcalRatio.prots * prots +
    kcalRatio.fats * fats
  );

  const macroNeeds = { carbs, prots, fats, kcal };

  return macroNeeds;
}

type FormulaRatio = {
  [key in WeightGoal]: {
    carbs: number
    prots: number
    fats: number
  }
}