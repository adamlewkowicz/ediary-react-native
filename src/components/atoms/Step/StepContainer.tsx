import React, { ReactNodeArray } from 'react';
import styled from 'styled-components/native';
import { useSteps } from '../../../hooks';
import { ButtonPrimary, ButtonSecondary } from '../Button';

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
  const step = useSteps(stepCount);

  const handleNextStepButtonPress = (): void => {
    if (step.isLastStep) {
      props.onSubmit();
    } else {
      step.next();
    }
  }

  return (
    <Container>
      <ActiveStepContext.Provider value={step.activeStep}>
        {props.children}
      </ActiveStepContext.Provider>
      <InfoContainer>
        {!step.isFirstStep && (
          <BackButton
            onPress={step.back}
            accessibilityLabel="Wróć"
          >
            Wróć
          </BackButton>
        )}
        <NextButton
          isLoading={props.isLoading}
          onPress={handleNextStepButtonPress}
          accessibilityLabel="Przejdź dalej"
        >
          {step.isLastStep ? props.lastStepButtonTitle : props.buttonTitle}
        </NextButton>
      </InfoContainer>
    </Container>
  );
}

const Container = styled.View`
  padding: 10px;
  justify-content: space-between;
  flex: 1;
`

const BackButton = styled(ButtonSecondary)`
  flex: 1;
  margin-right: 16px;
`

const NextButton = styled(ButtonPrimary)`
  flex: 4;
`

const InfoContainer = styled.View`
  padding: 25px 15px;
  flex-direction: row;
`