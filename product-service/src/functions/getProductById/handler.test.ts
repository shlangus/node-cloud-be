import type { GetProductByIdEvent } from './event';
import { getProductById } from './handler';

import { productService } from '@services/productService';

jest.mock('@services/productService', () => ({
  productService: {
    getById: jest.fn()
  }
}));

describe('getProductById', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when malformed event is passed', () => {
    it('should return 500', async () => {
      const result = await getProductById({} as any);

      expect.assertions(1);
      expect(result.statusCode).toBe(500);
    });
  });

  // for sake of time let's use some dirty hacks
  const makeEvent = <T>(params: T): GetProductByIdEvent => ({
    ...params
  }) as unknown as GetProductByIdEvent;

  const mockGetById = fn => {
    (productService.getById as jest.Mock).mockImplementation(fn);
  };

  describe('when existing product id is provided', () => {
    it('should return 200 with found product', async () => {
      mockGetById(async id => ({ id }));
      const id = 3;
      const event = makeEvent({ pathParameters: { id } });

      const result = await getProductById(event);

      expect.assertions(2);
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).id).toBe(id);
    });
  });

  describe('when non-existing product id is provided', () => {
    it('should return 404', async () => {
      mockGetById(async () => {
      });
      const id = 3;
      const event = makeEvent({ pathParameters: { id } });

      const result = await getProductById(event);

      expect.assertions(2);
      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body).message).toBeDefined();
    });
  });

  describe('when underlying error occurs', () => {
    it('should return 500', async () => {
      mockGetById(async () => {
        throw '';
      });
      const event = makeEvent({ pathParameters: { id: 1 } });

      const result = await getProductById(event);

      expect.assertions(2);
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBeDefined();
    });
  });

});
