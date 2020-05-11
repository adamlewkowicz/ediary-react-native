import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Animated, TouchableOpacityProps } from 'react-native';
import { useAnimatedValue } from '../../../hooks/use-animated-value';
import { ButtonRounded } from '..';
import { THEME } from '../../../common/theme';

interface ButtonHoldableProps {
  holdDuration?: number
  onPressExceeded: () => void
  children?: ReactNode
  icon?: JSX.Element
  accessibilityLabel?: TouchableOpacityProps['accessibilityLabel']
}

export const ButtonHoldable: React.FC<ButtonHoldableProps> = (props) => {
  const animatedValue = useAnimatedValue(1);
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.color.error, THEME.color.primaryDark]
  });
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });

  const handlePressHold = () => {
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

  const handlePressOut = () => {
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
        accessibilityLabel={props.accessibilityLabel}
        onPressIn={handlePressHold}
        onPressOut={handlePressOut}
        icon={props.icon}
      >
        {props.children}
      </ButtonRounded>
    </Container>
  );
}

ButtonHoldable.defaultProps = {
  holdDuration: 1500
}

const Container = styled(Animated.View)`
  border-radius: 50;
`