import React, { useEffect, ReactNode } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { useAnimatedValue } from '../../hooks/use-animated-value';

interface HoldableButtonProps {
  holdDuration?: number
  onPressExceeded: () => void
  children?: ReactNode
}

export const HoldableButton: React.FC<HoldableButtonProps> = (props) => {
  const animatedValue = useAnimatedValue(1);
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  const handleHoldDuration = () => {
    Animated.timing(
      animatedValue,
      {
        toValue: 0,
        duration: props.holdDuration,
      }
    ).start(() => {
      props.onPressExceeded();
    });
  }

  const handleHoldDurationClear = () => {
    Animated.timing(
      animatedValue,
      {
        toValue: 1,
        duration: props.holdDuration
      }
    ).stop();
  }

  useEffect(() => {
    return () => handleHoldDurationClear();
  }, []);

  return (
    <Container style={{ opacity: animatedValue }}>
      <Button
        onPressIn={handleHoldDuration}
        onPressOut={handleHoldDurationClear}
      >
        {props.children}
      </Button>
    </Container>
  );
}

HoldableButton.defaultProps = {
  holdDuration: 2000
}

const Container = styled(Animated.View)`
  border-radius: 50;
  background-color: #e67e22;
  width: 80px;
  height: 80px;
`

const Button = styled.TouchableOpacity`
  border-radius: 50;
  width: 80px;
  height: 80px;
`