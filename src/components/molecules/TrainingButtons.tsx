import React, { useState } from 'react';
import styled from 'styled-components/native';
import { HoldableButton } from '../HoldableButton';
import { ButtonRounded } from '../atoms';
import { layoutAnimateEase } from '../../utils';

interface TrainingButtonsProps {
  isTrainingPaused: boolean
  onTrainingPause: (status?: boolean) => void
  onTrainingFinish: () => void
}

export const TrainingButtons = (props: TrainingButtonsProps) => {
  const [isLocked, setIsLocked] = useState(false);

  

  if (props.isTrainingPaused) {
    return (
      <Container>
        <ButtonRounded onPress={() => layoutAnimateEase() || props.onTrainingPause(false)}>
          Kontynuuj
        </ButtonRounded>
        <HoldableButton
          onPressExceeded={props.onTrainingFinish}
        >
          Zakończ trening
        </HoldableButton>
      </Container>
    );
  }

  if (isLocked) {
    return (
      <HoldableButton
        onPressExceeded={() => layoutAnimateEase() || setIsLocked(false)}
      />  
    );
  }

  return (
    <Container>
      <ButtonRounded onPress={() => layoutAnimateEase() || props.onTrainingPause(true)}>
        Pauza
      </ButtonRounded>
      <ButtonRounded onPress={() => layoutAnimateEase() || setIsLocked(true)}>
        Zablokuj
      </ButtonRounded>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`