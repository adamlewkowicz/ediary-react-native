import { useAnimatedValue } from './use-animated-value';
import { Animated } from 'react-native';
import { useEffect } from 'react';

interface Options {
  isRunning: boolean
  duration?: number
}

/**
 * Animates value from 0 to 1 during a loop.
 */
export const useAnimatedLoop = (options: Options) => {
  const animatedValue = useAnimatedValue(0);
  const { isRunning, duration = 700 } = options;

  useEffect(() => {
    const increment = () => {
      Animated.timing(
        animatedValue,
        {
          toValue: 1,
          duration,
        }
      ).start((result) => {
        if (result.finished &&options.isRunning) {
          decrement();
        }
      });
    }

    const decrement = () => {
      Animated.timing(
        animatedValue,
        {
          toValue: 0,
          duration,
        }
      ).start((result) => {
        if (result.finished && options.isRunning) {
          increment();
        }
      });
    }

    if (isRunning) {
      increment();
    }
  }, [isRunning, options.isRunning]);

  return animatedValue;
}