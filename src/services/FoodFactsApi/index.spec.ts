import { FoodFactsApi } from '.';
import findOneByBarcodeResponseMock from 'openfoodfac-ts/src/OpenFoodFactsApi/__mocks__/response.json';

describe('FoodFactsApi', () => {

  let foodFactsApi: FoodFactsApi;

  beforeEach(() => foodFactsApi = new FoodFactsApi());

  describe('findOneByBarcode()', () => {

    it('should normalize product correctly 📝', async () => {
      const barcode = '5900512300108';
      const fetchMock = fetch as jest.Mock;
    
      fetchMock.mockImplementationOnce(async () => ({
        ok: true,
        json: async () => findOneByBarcodeResponseMock
      }));
    
      const normalizedProduct = await foodFactsApi.findOneByBarcode(barcode);
    
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(normalizedProduct).toMatchSnapshot();
    });

  });

});