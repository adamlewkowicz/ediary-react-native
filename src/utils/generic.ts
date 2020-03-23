
/**
 * Maps over an array and runs promise returned from a callback in a sequence.
 * @param items array of elements to iterate on
 * @param callback callback that is executed on each iteration
 */
export const mapAsyncSequence = async <T, R>(
  items: T[],
  callback: (item: T) => Promise<R>
) => {
  const result: R[] = [];

  for (const item of items) {
    const resultItem = await callback(item);
    result.push(resultItem);
  }

  return result;
}

export function findOrFail<T>(
  array: T[],
  matcher: (item: T, index: number, self: T[]) => boolean
): T {
  const foundItem = array.find(matcher);
  if (!foundItem) {
    throw new Error(
      '[findOrFail] - No item could be found for specified criteria'
    );
  }
  return foundItem;
}

const createArrayOfLength = <T>(
  length: number,
  callback: (index: number) => T
): T[] => Array.from({ length }, (_, index) => callback(index));

export const fillArrayWithinRange = (
  { from, to }: { from: number; to: number }
): number[] => {
  const zeroBasedCountFill = 1;
  const length = to - from + zeroBasedCountFill;
  return createArrayOfLength(length, index => index + from);
}

export const objectMap = <
  T extends object,
  Property extends keyof T = keyof T,
  Value = T[Property]
>(
  obj: T,
  callback: (property: Property, value: Value) => Value
): T => {
  return Object.fromEntries(
    Object
      .entries(obj)
      .map(([property, value]) => [property, callback(property as Property, value)])
  ) as T;
}

export const round = (value: number, scale = 10) => Math.round(value * scale) / scale;

export const filterByUniqueProperty = <
  E extends object,
  A extends E[]
>(property: keyof E) => (element: E, index: number, self: A): boolean => {
  const foundIndex = self.findIndex(anyElement =>
    anyElement[property] === element[property]
  );
  return foundIndex === index;
}

export const filterByUniqueId = filterByUniqueProperty('id');