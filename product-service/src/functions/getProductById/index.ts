import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 120,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{id}',
        request: {
          parameters: {
            paths: {
              id: true
            }
          }
        },
        cors: true,
        documentation: {
          summary: 'Product',
          description: 'Returns a product with given id',
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: 'Product'
              },
              responseModels: {
                'application/json': 'ProductResponse'
              }
            },
            {
              statusCode: 404,
              responseBody: {
                description: 'Product not found'
              },
              responseModels: {
                'application/json': 'NotFoundResponse'
              }
            },
            {
              statusCode: 500,
              responseBody: {
                description: 'An error retrieving product list'
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
}
