import { FriscoApi } from '.';
import friscoResponseMock from './__mocks__/frisco-query.json';

describe('FriscoApi', () => {

  let friscoApi: FriscoApi;

  beforeEach(() => friscoApi = new FriscoApi());

  describe('findByBarcode()', () => {

    it('should normalize product correctly', async () => {
      const name = 'apple';
      const fetchMock = fetch as jest.Mock;
    
      fetchMock.mockImplementationOnce(async () => ({
        ok: true,
        json: async () => friscoResponseMock
      }));
    
      const [normalizedProduct] = await friscoApi.findByBarcode(name);
    
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(normalizedProduct).toMatchSnapshot();
    });

  });

});