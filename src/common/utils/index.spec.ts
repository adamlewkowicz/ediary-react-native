import {
  calcMacroNeedsLeft,
  debounce,
  mapAsyncSequence,
  filterByUniqueId,
  findOrFail,
  sortByMostAccurateName,
} from '.';

describe('debounce()', () => {
  it('should call debounced function only once', () => {
    jest.useFakeTimers();
    const actionMock = jest.fn();
    const debounceHandler = debounce();
    const debounceTime = 150;
  
    debounceHandler(actionMock, debounceTime);
    debounceHandler(actionMock, debounceTime);
    jest.advanceTimersByTime(debounceTime);
  
    expect(actionMock).toHaveBeenCalledTimes(1);
  });
});

describe('mapAsyncSequence()', () => {
  it('should run promises in a sequence', async () => {
    const promiseMock = jest.fn().mockImplementation(async () => {});
    const dataMock = [1, 2];
  
    await mapAsyncSequence(dataMock, value => promiseMock(value));
  
    expect(promiseMock).toHaveBeenCalledTimes(dataMock.length);
    expect(promiseMock).toHaveBeenNthCalledWith(1, dataMock[0]);
    expect(promiseMock).toHaveBeenNthCalledWith(2, dataMock[1]);
  });
});

describe('filterByUniqueId()', () => {
  it('should filter items by unique id', () => {
    const items = [{ id: 1 }, { id: 1 }];

    const filteredItems = items.filter(filterByUniqueId);
  
    expect(filteredItems.length).toBeLessThan(items.length);
  });
});

describe('findOrFail()', () => {
  it('should throw error if no item was found', () => {
    const items = [{ name: 'A' }];
    try {
      findOrFail(items, item => item.name === 'B');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('calcMacroNeedsLeft()', () => {
  it('should calculate macro differences properly', () => {
    const baseMacro = { carbs: 0, prots: 0, fats: 0, kcal: 0 };
    const macroEaten = { ...baseMacro, carbs: 400 };
    const macroNeeded = { ...baseMacro, carbs: 1000 };
  
    const result = calcMacroNeedsLeft(macroEaten, macroNeeded);
  
    expect(result.carbs.diff).toBeGreaterThan(0);
    expect(result.carbs.ratio).toBeGreaterThan(0);
    expect(result.carbs).toMatchSnapshot();
  });
});

describe('sortByMostAccurateName()', () => {
  it('should sort items by most matching name', () => {
    const name = 'orange';
    const dataMock = [
      { name: 'Orange a' },
      { name: 'Eng' },
      { name: 'Orange' },
    ];
  
    const result = dataMock.sort(sortByMostAccurateName(name));
  
    expect(result).toMatchSnapshot();
  });
});