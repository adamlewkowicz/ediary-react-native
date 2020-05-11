import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ButtonRounded, ButtonHoldable } from '../atoms';
import PauseIcon from '../../../assets/img/pause.svg';
import PadlockIcon from '../../../assets/img/padlock.svg';
import PlayIcon from '../../../assets/img/play.svg';
import FinishIcon from '../../../assets/img/racing.svg';
import { THEME } from '../../common/theme';

interface TrainingActionButtonsProps {
  isPaused: boolean
  onPause: () => void
  onUnpause: () => void
  onFinish: () => void
}

export const TrainingActionButtons = (props: TrainingActionButtonsProps) => {
  const [isLocked, setIsLocked] = useState(false);

  const handleLock = () => setIsLocked(true);

  const handleUnlock = () => setIsLocked(false);

  if (props.isPaused) {
    return (
      <Container>
        <ButtonRounded
          onPress={props.onUnpause}
          icon={<PlayIcon {...style} />}
          accessibilityLabel="Kontynuuj"
        />
        <ButtonHoldable
          onPressExceeded={props.onFinish}
          icon={<FinishIcon {...style} />}
          accessibilityLabel="Zakończ trening"
        />
      </Container>
    );
  }

  if (isLocked) {
    return (
      <ButtonHoldable
        onPressExceeded={handleUnlock}
        icon={<PadlockIcon {...style} />}
        accessibilityLabel="Odblokuj"
      />  
    );
  }

  return (
    <Container>
      <ButtonRounded
        onPress={props.onPause}
        icon={<PauseIcon {...style} />}
        accessibilityLabel="Pauza"
      />
      <ButtonRounded
        onPress={handleLock}
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