import { useEffect } from 'react'
import { Animated, Easing } from 'react-native';
import { useAnimatedValue } from './use-animated-value';

const defaultConfig: Partial<Animated.TimingAnimationConfig> = {
  easing: Easing.elastic(1),
  useNativeDriver: true,
}

export const useAnimatedTiming = <T extends number>(
  animateToValue: T,
  config?: Partial<Animated.TimingAnimationConfig>,
): Animated.Value => {
  const animatedValue = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(
      animatedValue,
      {
        toValue: animateToValue,
        ...defaultConfig,
        ...config,
      }
    ).start();
  }, [animateToValue]);

  return animatedValue;
}