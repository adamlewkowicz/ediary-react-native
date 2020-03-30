import { MacroElements } from '../types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Selectors } from '../store';
import * as Utils from '../utils';

export const useCalculatedMacro = <T extends MacroElements>(
  macroValues: T,
  quantity: number
) => {
  const userMacroNeeds = useSelector(Selectors.getUserMacroNeeds); 

  const macro = useMemo(
    () => Utils.calculateMacroPerQuantity(macroValues, quantity),
    [macroValues, quantity]
  );

  const macroPercentages = useMemo(
    () => Utils.calculateMacroPercentages(macro),
    [macro]
  );

  const macroNeeds = useMemo(
    () => Utils.calculateMacroNeeds(macro, userMacroNeeds),
    [macro, userMacroNeeds]
  );
  
  return { macro, macroPercentages, macroNeeds };
}