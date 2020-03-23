import { ObjectNumeric, MacroElements, BaseMacroElements, ObjectEntries } from '../types';
import { KCAL_IN_ONE_MACRO_GRAM } from '../common/consts';
import { objectMap, round } from './generic';

const objectEntries: ObjectEntries = Object.entries;

export const calculateCaloriesByMacro = (
  macro: BaseMacroElements
): number => {
  return objectEntries(macro)
    .reduce(
      (kcal, [macroName, macroQuantity]) => kcal += macroQuantity * KCAL_IN_ONE_MACRO_GRAM[macroName],
      0
    );
}

export const calculatePercentage = (portion: number, total: number): number => {
  if (total === 0) return 0;
  return Math.floor(portion / total * 100);
}

export const calculateMacroPerQuantity = <T extends MacroElements>(
  macroValuesPerHundredQuantity: T,
  quantity: number
): T => objectMap(
  macroValuesPerHundredQuantity,
  (_, macroValue: number) => round(macroValue * quantity / 100, 100)
);

export const calculateMacroPercentages = <T extends BaseMacroElements>(
  macroValues: T
): BaseMacroElements => {
  const macroSum = macroValues.carbs + macroValues.prots + macroValues.fats;

  const carbs = calculatePercentage(macroValues.carbs, macroSum);
  const prots = calculatePercentage(macroValues.prots, macroSum);
  const fats = calculatePercentage(macroValues.fats, macroSum);

  return { carbs, prots, fats };
}

const calculateMacroValueNeed = (
  eaten: number,
  needed: number
): MacroNeed => ({
  eaten,
  needed,
  left: needed - eaten,
  percentage: calculatePercentage(eaten, needed),
});

export const calculateMacroNeeds = <T extends object>(
  macroValuesEaten: T,
  macroValuesNeeded: T
): MacroElements<MacroNeed> => objectMap(
  macroValuesEaten,
  (macroName, macroValueEaten) => {
    // TODO: refactor types
    const macroValueNeeded = macroValuesNeeded[macroName] as any as number;

    const macroValueNeed = calculateMacroValueNeed(
      macroValueEaten,
      macroValueNeeded
    );

    return macroValueNeed;
  }
);

type MacroNeed = {
  eaten: number
  needed: number
  left: number,
  percentage: number
}

const calculateObjectsValueSum = <T extends ObjectNumeric>(objects: T[]): T => {
  const [initialObj, ...restObjects] = objects;

  return restObjects.reduce<T>((acc, current) => {
    const next = { ...acc };

    for (const key in next) {
      // @ts-ignore
      next[key] = Math.round(next[key] + current[key]);
    }

    return next;
  }, { ...initialObj });
}

export const calculateMacroSum = <
  M extends MacroElements,
  T extends { calcedMacro: M } = { calcedMacro: M }
>(
  items: T[]
): M => {
  const macroValueObjects = items.map(item => item.calcedMacro);
  const macroValueSum = calculateObjectsValueSum(macroValueObjects)

  return macroValueSum;
}