import { MacroElements } from '../types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Selectors } from '../store';
import { utils } from '../utils';

export const useCalculatedMacro = <T extends MacroElements>(
  macroValues: T,
  quantity: number
) => {
  const userMacroNeeds = useSelector(Selectors.getUserMacroNeeds); 

  const macro = useMemo(
    () => utils.calculateMacroPerQuantity(macroValues, quantity),
    [macroValues, quantity]
  );

  const macroPercentages = useMemo(
    () => utils.calculateMacroPercentages(macro),
    [macro]
  );

  const macroNeeds = useMemo(
    () => utils.calculateMacroNeeds(macro, userMacroNeeds),
    [macro, userMacroNeeds]
  );
  
  return { macro, macroPercentages, macroNeeds };
}