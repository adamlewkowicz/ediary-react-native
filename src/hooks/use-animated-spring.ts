import { useRef, useEffect } from 'react'
import { Animated, Easing } from 'react-native';

export const useAnimatedSpring = <T extends number>(toValue: T, delay = 0): Animated.Value => {
  const animatedValue = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      animatedValue.current,
      {
        toValue,
        delay,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }
    ).start();
  }, [toValue]);

  return animatedValue.current;
}