import { MacroElements } from '../../types';
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

export const getProductMock = () => ({
  carbs: Math.round(Math.random() * 400),
  prots: Math.round(Math.random() * 400),
  fats: Math.round(Math.random() * 400),
  kcal: Math.round(Math.random() * 400),
  quantity: Math.round(Math.random() * 150)
});