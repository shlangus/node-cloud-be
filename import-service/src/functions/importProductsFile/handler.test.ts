import { importProductsFile } from './handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3 as S3Mock } from '../../__mocks__/aws-sdk';

describe('importProductsFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // for sake of time let's use some dirty hacks
  const makeEvent = <T>(params: T): APIGatewayProxyEvent => ({
    ...params
  }) as unknown as APIGatewayProxyEvent;

  it('should call S3 api for getting signed URL', async () => {
    expect.assertions(1);
    const mock = jest.fn().mockResolvedValue('');
    S3Mock.mockGetSignedUrlPromise(mock);
    const event = makeEvent({
      queryStringParameters: { name: '1234.csv' }
    });

    await importProductsFile(event);

    expect(mock).toBeCalled();
  });

  describe('when S3 api call succeeds', () => {
    it('should return 200 with url', async () => {
      expect.assertions(2);
      const mock = jest.fn().mockResolvedValue('url');
      S3Mock.mockGetSignedUrlPromise(mock);
      const event = makeEvent({
        queryStringParameters: { name: '1234.csv' }
      });

      const result = await importProductsFile(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toBe('url');
    });
  });

  describe('when S3 api fails', () => {
    it('should return 500 with url', async () => {
      expect.assertions(1);
      const mock = jest.fn().mockRejectedValue('Error');
      S3Mock.mockGetSignedUrlPromise(mock);
      const event = makeEvent({
        queryStringParameters: { name: '1234.csv' }
      });

      const result = await importProductsFile(event);

      expect(result.statusCode).toBe(500);
    });
  });
});
