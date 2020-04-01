import { useState } from 'react';

export const useSteps = (options: Options) => {
  const [activeStep, setActiveStep] = useState(0);
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === options.stepCount - 1;

  const next = (): void => {
    if (!isLastStep) {
      setActiveStep(step => step + 1);
    }
  }

  const back = (): void => {
    if (!isFirstStep) {
      setActiveStep(step => step - 1);
    }
  }

  return {
    activeStep,
    next,
    back,
    isLastStep,
  }
}

interface Options {
  stepCount: number
}