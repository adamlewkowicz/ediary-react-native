
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

const eachValueEquals = <V>(
  equalityValue: V
) => <T extends object>(obj: T): boolean => {
  return Object.values(obj).every(value => value === equalityValue);
}

export const eachValueEqualsZero = eachValueEquals(0);