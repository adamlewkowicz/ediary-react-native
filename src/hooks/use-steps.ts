import { useState } from 'react';

export const useSteps = <T extends number>(initialStep: T) => {
  const [activeStep, setActiveStep] = useState<T>(initialStep);

  const next = () => {
    setActiveStep(step => step + 1 as T);
  }

  const back = () => {

  }
}