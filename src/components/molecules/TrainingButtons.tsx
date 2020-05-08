import React from 'react';
import styled from 'styled-components/native';
import { HoldableButton } from '../HoldableButton';
import { ButtonPrimary } from '../atoms';

interface TrainingButtonsProps {
  isLocked: boolean
  onLockToggle: (status: boolean) => void
  isTrainingPaused: boolean
  onTrainingPause: () => void
  onTrainingFinish: () => void
}

export const TrainingButtons = (props: TrainingButtonsProps) => {

  if (props.isLocked) {
    return (
      <HoldableButton
        onPressExceeded={() => props.onLockToggle(false)}
      />  
    );
  }

  return (
    <>
      <ButtonPrimary
        onPress={props.onTrainingPause}
      >
        {props.isTrainingPaused ? 'Kontynuuj' : 'Pauza'}
      </ButtonPrimary>
      <ButtonPrimary onPress={props.onTrainingFinish}>
        Zakończ
      </ButtonPrimary>
      <ButtonPrimary
        onPress={() => props.onLockToggle(true)}
      >
        Zablokuj
      </ButtonPrimary>
    </>
  );
}

const Container = styled.View`

`