import React, { useContext, ReactNode } from 'react';

interface StepContainerProps {
  activeStep: number
  children: ReactNode
}

const StepContext = React.createContext(0)

export const StepContainer = (props: StepContainerProps) => {

  return (
    <StepContext.Provider value={props.activeStep}>
      {props.children}
    </StepContext.Provider>
  );
}

interface StepProps {
  activeStep: number
  children: ReactNode
}

export const Step = (props: StepProps) => {
  const activeStep = useContext(StepContext);

  if (activeStep === props.activeStep) {
    return props.children;
  }

  return null;
}