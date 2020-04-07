
export const isLastCharEqual = (value: string, character: string): boolean => {
  const lastCharIndex = value.length - 1;

  if (value.charAt(lastCharIndex) === character) {
    return true;
  }

  return false;
}

export const isANumber = (value: number): boolean => {
  return !Number.isNaN(value);
}