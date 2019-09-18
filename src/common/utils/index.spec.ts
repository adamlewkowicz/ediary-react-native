import { calcMacroNeedsLeft } from '.'

test('calcMacroNeedsLeft', () => {
  const macroEaten = {
    carbs: 400,
    prots: 0,
    fats: 0,
    kcal: 0
  }
  const macroNeeded = {
    carbs: 1000,
    prots: 0,
    fats: 0,
    kcal: 0
  }

  const result = calcMacroNeedsLeft(
    macroEaten,
    macroNeeded
  );

  expect(result.carbs.diff).toEqual(macroNeeded.carbs - macroEaten.carbs);
});