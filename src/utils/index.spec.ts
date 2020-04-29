import * as Utils from './index';

describe('Utils 🛠️', () => {

  describe('createDebouncedFunc', () => {

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should call debounced function only once', () => {
      const actionMock = jest.fn();
    
      const debounceTime = 150;
      const debouncedAction = Utils.createDebouncedFunc(actionMock, debounceTime);
    
      debouncedAction(actionMock, debounceTime);
      debouncedAction(actionMock, debounceTime);
    
      jest.advanceTimersByTime(debounceTime);
    
      expect(actionMock).toHaveBeenCalledTimes(1);
    });

  });

  describe('mapAsyncSequence', () => {

    it('should run promises in a sequence', async () => {
      const promiseMock = jest.fn().mockImplementation(async () => {});
      const dataMock = [1, 2];
    
      await Utils.mapAsyncSequence(dataMock, value => promiseMock(value));
    
      expect(promiseMock).toHaveBeenCalledTimes(dataMock.length);
      expect(promiseMock).toHaveBeenNthCalledWith(1, dataMock[0]);
      expect(promiseMock).toHaveBeenNthCalledWith(2, dataMock[1]);
    });

  });

  describe('filterByUniqueId', () => {

    it('should filter items by unique id', () => {
      const items = [{ id: 1 }, { id: 1 }];
      const filteredItems = items.filter(Utils.filterByUniqueId);
    
      expect(filteredItems.length).toBeLessThan(items.length);
    });

  });
  
  describe('findOrFail', () => {
  
    it('should throw error if no item was found', () => {
      const items = [{ name: 'A' }];
      const subject = () => Utils.findOrFail(items, item => item.name === 'B');
      expect(subject).toThrowError();
    });
  
  });

  describe('sortByMostAccurateName', () => {
  
    it('should sort items by most matching name', () => {
      const name = 'orange';
      const dataMock = [
        { name: 'Orange a' },
        { name: 'Eng' },
        { name: 'Orange' },
      ];
    
      const result = dataMock.sort(Utils.sortByMostAccurateName(name));
    
      expect(result).toMatchSnapshot();
    });
  
  });

  describe('isLastCharEqual', () => {
  
    it('should return true if last char equals given char', () => {
      expect(Utils.isLastCharEqual('ab', 'b')).toEqual(true);
      expect(Utils.isLastCharEqual('ab', 'c')).not.toEqual(true);
    });
  
  });

  describe('isANumber', () => {
  
    it('should return true if value is a number', () => {
      expect(Utils.isANumber(10)).toEqual(true);
      expect(Utils.isANumber(Number.NaN)).not.toEqual(true);
    });
  
  });
  
  describe('isNil', () => {
  
    it('should return true if given value is nill (null/undefined)', () => {
      expect(Utils.isNil(null)).toEqual(true);
      expect(Utils.isNil(undefined)).toEqual(true);
      expect(Utils.isNil(5)).not.toEqual(true);
    });
  
  });

  describe('eachValueEqualsZero', () => {
  
    it('should return true if each object value equals zero', () => {
      expect(Utils.eachValueEqualsZero({ a: 0, b: 0 })).toEqual(true);
      expect(Utils.eachValueEqualsZero({ a: 0, b: 1 })).not.toEqual(true);
    });
  
  });

  describe('cancelablePromise', () => {

    describe('while promise fulfilled', () => {
    
      it('should remove listener', async () => {
        const promiseFake = Promise.resolve();
        const abortController = new AbortController();
  
        await Utils.cancelablePromise(promiseFake, abortController);
  
        expect(abortController.signal.removeEventListener).toHaveBeenCalledTimes(1);
      });
    
    });
  
  });

});