
export const isLastCharEqual = (value: string, character: string): boolean => {
  const lastCharIndex = value.length - 1;

  if (value.charAt(lastCharIndex) === character) {
    return true;
  }

  return false;
}

export const isANumber = (value: unknown): value is number => {
  if (typeof value !== 'number') {
    return false;
  }
  if (Number.isNaN(value)) {
    return false;
  }
  return true;
}

const eachValueEquals = <V>(
  equalityValue: V
) => <T extends object>(obj: T): boolean => {
  return Object.values(obj).every(value => value === equalityValue);
}

export const eachValueEqualsZero = eachValueEquals(0);

export const isNil = <T>(value: T | Nil): value is Nil => value == null;

type Nil = null | undefined;