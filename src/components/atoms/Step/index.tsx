import React, { ReactNodeArray } from 'react';
import styled from 'styled-components/native';
import { useSteps } from '../../../hooks';
import { ButtonPrimary } from '../Button';

export const ActiveStepContext = React.createContext(0);

interface StepContainerProps {
  buttonTitle: string
  lastStepButtonTitle: string
  onSubmit: () => void
  isLoading?: boolean
  children: ReactNodeArray
}

export const StepContainer = (props: StepContainerProps) => {
  const stepCount = props.children.length;

  const { next, isLastStep, activeStep } = useSteps({ stepCount });

  const handleNextStepButtonPress = (): void => {
    if (isLastStep) {
      props.onSubmit();
    } else {
      next();
    }
  }

  return (
    <Container>
      <ActiveStepContext.Provider value={activeStep}>
        {props.children}
      </ActiveStepContext.Provider>
      <InfoContainer>
        <ButtonPrimary
          isLoading={props.isLoading}
          onPress={handleNextStepButtonPress}
          accessibilityLabel="Przejdź dalej"
        >
          {isLastStep ? props.lastStepButtonTitle : props.buttonTitle}
        </ButtonPrimary>
      </InfoContainer>
    </Container>
  );
}

const Container = styled.View`
  padding: 10px;
  justify-content: space-between;
  flex: 1;
`

const InfoContainer = styled.View`
  padding: 25px 15px;
`

export * from './Step';