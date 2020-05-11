import { useState, useEffect, useRef } from 'react'

export const useInterval = () => {
  const [counter, setCounter] = useState(0);
  const interval = useRef<NodeJS.Timeout>();

  const stop = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  }

  useEffect(() => {
    interval.current = setInterval(
      () => setCounter(c => c + 1),
      1000
    );

    return () => stop();
  }, []);

  return { counter, stop };
}