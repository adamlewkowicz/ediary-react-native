import {
  mapAsyncSequence,
  filterByUniqueId,
  findOrFail,
  sortByMostAccurateName,
} from '.';
import { createDebouncedFunc } from './common';

describe('Utils', () => {

  describe('createDebouncedFunc', () => {

    test('debounced function gets called only once', () => {
      jest.useFakeTimers();
      const actionMock = jest.fn();
    
      const debounceTime = 150;
      const debouncedAction = createDebouncedFunc(actionMock, debounceTime);
    
      debouncedAction(actionMock, debounceTime);
      debouncedAction(actionMock, debounceTime);
    
      jest.advanceTimersByTime(debounceTime);
    
      expect(actionMock).toHaveBeenCalledTimes(1);
    });

  });

  describe('mapAsyncSequence', () => {

    test('runs promises in a sequence', async () => {
      const promiseMock = jest.fn().mockImplementation(async () => {});
      const dataMock = [1, 2];
    
      await mapAsyncSequence(dataMock, value => promiseMock(value));
    
      expect(promiseMock).toHaveBeenCalledTimes(dataMock.length);
      expect(promiseMock).toHaveBeenNthCalledWith(1, dataMock[0]);
      expect(promiseMock).toHaveBeenNthCalledWith(2, dataMock[1]);
    });

  });

  describe('filterByUniqueId', () => {

    test('filters items by unique id', () => {
      const items = [{ id: 1 }, { id: 1 }];
      const filteredItems = items.filter(filterByUniqueId);
    
      expect(filteredItems.length).toBeLessThan(items.length);
    });

  });
  
  describe('findOrFail', () => {
  
    test('throws error if no item was found', () => {
      const items = [{ name: 'A' }];
      const subject = () => findOrFail(items, item => item.name === 'B');
      expect(subject).toThrowError();
    });
  
  });

  describe('sortByMostAccurateName', () => {
  
    test('sorts items by most matching name', () => {
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
  
});