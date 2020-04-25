import { useRef } from 'react'
import { Animated } from 'react-native';

export const useAnimatedValue = <T extends number>(initialValue: T): Animated.Value => {
  const animatedValue = useRef(new Animated.Value(initialValue));
  return animatedValue.current;
}