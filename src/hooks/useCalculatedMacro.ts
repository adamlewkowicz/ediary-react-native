import { MacroElements } from '../types';
import { useMemo } from 'react';
import { calculateMacroPerQuantity, calculateMacroPercentages } from '../common/utils';

export const useCalculatedMacro = <T extends MacroElements>(
  macroValues: T,
  quantity: number
) => {

  const macro = useMemo(
    () => calculateMacroPerQuantity(macroValues, quantity),
    [macroValues, quantity]
  );

  const macroPercentages = useMemo(
    () => calculateMacroPercentages(macro),
    [macro]
  );
  
  return { macro, macroPercentages };
}