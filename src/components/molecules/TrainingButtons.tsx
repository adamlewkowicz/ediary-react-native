import React, { useState } from 'react';
import styled from 'styled-components/native';
import { HoldableButton } from '../HoldableButton';
import { ButtonRounded } from '../atoms';
import PauseIcon from '../../../assets/img/pause.svg';
import PadlockIcon from '../../../assets/img/padlock.svg';
import PlayIcon from '../../../assets/img/play.svg';
import FinishIcon from '../../../assets/img/racing.svg';
import { THEME } from '../../common/theme';

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
        <ButtonRounded
          onPress={() => props.onTrainingPause(false)}
          icon={<PlayIcon {...style} />}
          accessibilityLabel="Kontynuuj"
        />
        <HoldableButton
          onPressExceeded={props.onTrainingFinish}
          icon={<FinishIcon {...style} />}
        >
          Zakończ trening
        </HoldableButton>
      </Container>
    );
  }

  if (isLocked) {
    return (
      <HoldableButton
        onPressExceeded={() => setIsLocked(false)}
        icon={<PadlockIcon {...style} />}
        // accessibilityLabel="Odblokuj"
      />  
    );
  }

  return (
    <Container>
      <ButtonRounded
        onPress={() => props.onTrainingPause(true)}
        icon={<PauseIcon {...style} />}
        accessibilityLabel="Pauza"
      />
      <ButtonRounded
        onPress={() => setIsLocked(true)}
        icon={<PadlockIcon {...style} />}
        accessibilityLabel="Zablokuj"
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`

const style = {
  width: 32,
  height: 32,
  fill: THEME.color.primaryLight
}