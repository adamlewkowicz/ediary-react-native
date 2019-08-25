import { MacroElements, DateTime } from '../../types';
import { MACRO_ELEMENTS } from '../../common/consts';

interface CalcMacroByQuantityData extends MacroElements {
  quantity: number
}
export const calcMacroByQuantity = <T extends CalcMacroByQuantityData>(
  macroData: T
) => MACRO_ELEMENTS.map(element => ({
  value: Math.round(macroData[element] * macroData.quantity / 100),
  element
}));

export const getDataFromTemplate = (template: Template) => ({
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0,
});

interface Template {
  name: string
  time: DateTime
}