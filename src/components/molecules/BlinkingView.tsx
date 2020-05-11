import React, { ReactNode } from 'react';
import { ViewProps, Animated } from 'react-native';
import { useAnimatedLoop } from '../../hooks/use-animated-loop';

interface BlinkingViewProps extends ViewProps {
  isBlinking: boolean
  children?: ReactNode
}

export const BlinkingView = ({ isBlinking, ...props }: BlinkingViewProps) => {
  const animatedValueLoop = useAnimatedLoop({ isRunning: isBlinking });
  const opacity = animatedValueLoop.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.1],
  });

  return (
    <Animated.View style={{ opacity }} {...props}>
      {props.children}
    </Animated.View>
  );
}