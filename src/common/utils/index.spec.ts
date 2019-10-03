import {
  calcMacroNeedsLeft,
  debounce_,
  mapAsyncSequence,
  filterByUniqueId,
  findOrFail,
  sortByMostAccurateName,
} from '.';

test('debounce - debounced function gets called only once', () => {
  jest.useFakeTimers();
  const actionMock = jest.fn();
  const debounceHandler = debounce_();
  const debounceTime = 150;

  debounceHandler(actionMock, debounceTime);
  debounceHandler(actionMock, debounceTime);

  jest.advanceTimersByTime(debounceTime);

  expect(actionMock).toHaveBeenCalledTimes(1);

  jest.clearAllTimers();
});

test('mapAsyncSequence - runs promises in a sequence', async () => {
  const promiseMock = jest.fn().mockImplementation(async () => {});
  const dataMock = [1, 2];

  await mapAsyncSequence(dataMock, value => promiseMock(value));

  expect(promiseMock).toHaveBeenCalledTimes(dataMock.length);
  expect(promiseMock).toHaveBeenNthCalledWith(1, dataMock[0]);
  expect(promiseMock).toHaveBeenNthCalledWith(2, dataMock[1]);
});

test('filterByUniqueId - filters items by unique id', () => {
  const items = [{ id: 1 }, { id: 1 }];
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
  };
  const macroNeeded = {
    carbs: 1000,
    prots: 0,
    fats: 0,
    kcal: 0
  };

  const result = calcMacroNeedsLeft(macroEaten, macroNeeded);

  expect(result.carbs.diff).toBeGreaterThan(0);
  expect(result.carbs.ratio).toBeGreaterThan(0);
  expect(result.carbs).toMatchSnapshot();
});

test('sortByMostAccurateName - sorts items by most matching name', () => {
  const name = 'orange';
  const dataMock = [
    { name: 'Orange a' },
    { name: 'Eng' },
    { name: 'Orange' },
  ];

  const result = dataMock.sort(sortByMostAccurateName(name));

  expect(result).toMatchSnapshot();
});