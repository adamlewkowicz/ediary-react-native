import { useState, useRef } from 'react';

export const useTypingValue = <T>(
  initialValue: T,
  debounceMs = 800
) => {
  const [input, setInput] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  const handleSetInput = (input: T): void => {
    clearTimeout(timeout.current as NodeJS.Timeout);
    setInput(input);

    if (!isTyping) setIsTyping(true);

    timeout.current = setTimeout(
      () => setIsTyping(false),
      debounceMs
    );
  }

  return [
    input,
    handleSetInput,
    isTyping,
  ] as const;
}