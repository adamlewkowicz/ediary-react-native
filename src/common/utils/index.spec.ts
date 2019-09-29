import {
  calcMacroNeedsLeft,
  debounce_,
  mapAsyncSequence,
  filterByUniqueId,
  findOrFail,
} from '.';

test('debounce - function gets called only once', () => {
  jest.useFakeTimers();
  const actionMock = jest.fn();
  const debouncer = debounce_();

  debouncer(actionMock, 150);
  debouncer(actionMock, 150);

  jest.runAllTimers();

  expect(actionMock).toHaveBeenCalledTimes(1);
});

test('mapAsyncSequence - runs promises in sequence [todo]', () => {
  // todo
});

test('filterByUniqueId - filters items by unique id', () => {
  const items = [{ id: 1, }, { id: 1 }];
  const filteredItems = items.filter(filterByUniqueId);
  
  expect(filteredItems.length).toBeLessThan(items.length);
});

test('findOrFail - throws error if no item was found', () => {
  const items = [{ name: 'A' }];
  try {
    findOrFail(items, item => item.name === 'B');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});

test('calcMacroNeedsLeft', () => {
  const macroEaten = {
    carbs: 400,
    prots: 0,
    fats: 0,
    kcal: 0
  }
  const macroNeeded = {
    carbs: 1000,
    prots: 0,
    fats: 0,
    kcal: 0
  }

  const result = calcMacroNeedsLeft(
    macroEaten,
    macroNeeded
  );

  expect(result.carbs.diff).toBeGreaterThan(0);
});