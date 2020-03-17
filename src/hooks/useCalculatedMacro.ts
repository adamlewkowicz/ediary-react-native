import { MacroElements } from '../types';
import { useMemo } from 'react';
import { calculateMacroPerQuantity, calculateMacroPercentages, calculateMacroNeeds } from '../common/utils';
import { useSelector } from 'react-redux';
import { Selectors } from '../store';

export const useCalculatedMacro = <T extends MacroElements>(
  macroValues: T,
  quantity: number
) => {
  const userMacroNeeds = useSelector(Selectors.getMacroNeeds); 

  const macro = useMemo(
    () => calculateMacroPerQuantity(macroValues, quantity),
    [macroValues, quantity]
  );

  const macroPercentages = useMemo(
    () => calculateMacroPercentages(macro),
    [macro]
  );

  const macroNeeds = useMemo(
    () => calculateMacroNeeds(macro, userMacroNeeds),
    [macro, userMacroNeeds]
  );
  
  return { macro, macroPercentages, macroNeeds };
}