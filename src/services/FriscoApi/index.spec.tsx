import { friscoApi } from '.';
import friscoResponseMock from './__mocks__/frisco-query.json';
(global as any).fetch = require('node-fetch');

jest.mock('node-fetch');

test('findByQuery - product is normalized correctly', async () => {
  const name = 'apple';
  const fetchMock = fetch;

  (fetchMock as jest.Mock).mockImplementationOnce(async () => ({
    ok: true,
    async json() {
      return friscoResponseMock;
    }
  }));

  const [normalizedProduct] = await friscoApi.findByBarcode(name);

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(normalizedProduct).toMatchSnapshot();
});