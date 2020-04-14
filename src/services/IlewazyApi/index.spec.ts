import { IlewazyApi } from '.';
import ilewazyResponseMock from './__mocks__/ilewazy.json';

describe('IlewazyApi', () => {

  let ilewazyApi: IlewazyApi;

  beforeEach(() => ilewazyApi = new IlewazyApi());

  describe('findByName()', () => {

    it('should normalize products correctly', async () => {
      const name = 'apple';
      const fetchMock = fetch as jest.Mock;
    
      fetchMock.mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ilewazyResponseMock
      }));
    
      const [
        firstNormalizedProduct,
        secondNormalizedProduct,
      ] = await ilewazyApi.findByName(name);
    
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(firstNormalizedProduct).toMatchSnapshot();
      expect(secondNormalizedProduct).toMatchSnapshot();
    });

  });

});