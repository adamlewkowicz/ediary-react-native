import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { useAnimatedValue } from '../../hooks/use-animated-value';
import { ButtonRounded } from '../atoms';
import { THEME } from '../../common/theme';

interface HoldableButtonProps {
  holdDuration?: number
  onPressExceeded: () => void
  children?: ReactNode
  icon?: JSX.Element
}

export const HoldableButton: React.FC<HoldableButtonProps> = (props) => {
  const animatedValue = useAnimatedValue(1);
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.color.error, THEME.color.primaryDark]
  });
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });

  const handleHoldDuration = () => {
    Animated.timing(
      animatedValue,
      {
        toValue: 0,
        duration: props.holdDuration,
      }
    ).start((result) => {
      if (result.finished) {
        props.onPressExceeded();
      }
    });
  }

  const handleHoldDurationClear = () => {
    Animated.timing(
      animatedValue,
      {
        toValue: 1,
        duration: props.holdDuration
      }
    ).start();
  }

  return (
    <Container style={{ backgroundColor, transform: [{ scale }] }}>
      <ButtonRounded
        onPressIn={handleHoldDuration}
        onPressOut={handleHoldDurationClear}
        icon={props.icon}
      >
        {props.children}
      </ButtonRounded>
    </Container>
  );
}

HoldableButton.defaultProps = {
  holdDuration: 1500
}

const Container = styled(Animated.View)`
  border-radius: 50;
`