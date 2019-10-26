import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';

let timeout: NodeJS.Timeout;

interface HoldableButtonProps {
  holdDuration: number
  onHoldEnd: () => void
}

export const HoldableButton: React.FC<HoldableButtonProps> = (props) => {
  const animatedValue = useRef(new Animated.Value(0));

  const handleHoldDuration = () => {
    timeout = setTimeout(props.onHoldEnd, props.holdDuration);
    Animated.timing(
      animatedValue.current,
      {
        toValue: 1,
        duration: props.holdDuration,
      }
    ).start();
  }

  const handleHoldDurationClear = () => {
    clearTimeout(timeout);
    Animated.timing(
      animatedValue.current,
      {
        toValue: 0,
        duration: props.holdDuration
      }
    ).stop();
  }

  useEffect(() => handleHoldDurationClear, []);

  return (
    <Container
      onPressIn={handleHoldDuration}
      onPressOut={handleHoldDurationClear}
    >

    </Container>
  );
}

HoldableButton.defaultProps = {
  holdDuration: 500
}

const Container = styled.TouchableOpacity``