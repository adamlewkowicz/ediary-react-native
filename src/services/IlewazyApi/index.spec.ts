import { IlewazyApi } from '.';
import ilewazyResponseMock from './__mocks__/ilewazy.json';
(global as any).fetch = require('node-fetch');

jest.mock('node-fetch');

describe('IlewazyApi', () => {

  let ilewazyApi: IlewazyApi;

  beforeEach(() => ilewazyApi = new IlewazyApi());

  test('findByName - products are normalized correctly', async () => {
    const name = 'apple';
    const fetchMock = fetch;
  
    (fetchMock as jest.Mock).mockImplementationOnce(async () => ({
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