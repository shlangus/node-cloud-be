import { getProductsList } from './handler';

import { productService } from '@services/productService';

jest.mock('@services/productService', () => ({
  productService: {
    getAll: jest.fn()
  }
}));

describe('getProductsList', () => {

  const mockGetAll = fn => {
    (productService.getAll as jest.Mock).mockImplementation(fn);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with a list of products', async () => {
    mockGetAll(async () => [{ id: 'test' }]);

    const result = await getProductsList();

    expect.assertions(2);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).length).toBe(1);
  });

  describe('when underlying error occurs', () => {
    it('should return 500', async () => {
      mockGetAll(async () => {
        throw '';
      });

      const result = await getProductsList();

      expect.assertions(2);
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBeDefined();
    });
  });

});
