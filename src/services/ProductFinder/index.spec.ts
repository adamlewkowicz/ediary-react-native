import { productFinder } from '.';
import ilewazyResponseMock from './__mocks__/ilewazy.json';
(global as any).fetch = require('node-fetch');

jest.mock('node-fetch');

test('Ilewazy - products are parsed correctly', async () => {
  const name = 'jabl';
  const [firstMockedProduct] = ilewazyResponseMock.data;

  // strongly typed mock
  const fetchMock: jest.Mock<GlobalFetch['fetch']> = fetch as any;

  (fetch as jest.Mock).mockImplementationOnce(async () => ({
    async json() {
      return ilewazyResponseMock;
    }
  }));

  const [firstProduct] = await productFinder.findByName(name);

  expect(fetch).toHaveBeenCalledTimes(1);
});