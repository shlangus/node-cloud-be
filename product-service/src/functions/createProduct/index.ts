import { handlerPath } from '@libs/handlerResolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/products',
        cors: true,
        request: {
          schema: {
            'application/json': schema
          }
        },
        documentation: {
          summary: 'Creates a product',
          description: 'Creates a product',
          requestBody: {
            description: 'A product information'
          },
          requestModels: {
            'application/json': 'CreateProductRequest'
          },
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: 'Created product id'
              },
              responseModels: {
                'application/json': 'CreateProductResponse'
              }
            },
            {
              statusCode: 500,
              responseBody: {
                description: 'An error during product creation'
              },
              responseModels: {
                'application/json': 'ErrorResponse'
              }
            }
          ]
        }
      }
    }
  ]
};
