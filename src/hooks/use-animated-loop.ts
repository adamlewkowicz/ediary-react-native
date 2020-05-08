import { useAnimatedValue } from './use-animated-value';
import { Animated } from 'react-native';
import { useEffect } from 'react';

interface Options {
  isRunning: boolean
  duration?: number
}

/**
 * Animates infinitely value from 0 to 1 in a loop.
 */
export const useAnimatedLoop = (options: Options) => {
  const animatedValue = useAnimatedValue(0);
  const { isRunning, duration = 700 } = options;

  const runTransitionLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          animatedValue,
          {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          animatedValue,
          {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }
        )
      ]),
    ).start();
  }

  const stopTransitionLoop = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (isRunning) {
      runTransitionLoop();
    } else {
      stopTransitionLoop();
    }
  }, [isRunning]);

  return animatedValue;
}