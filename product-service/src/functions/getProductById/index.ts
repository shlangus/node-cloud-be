import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
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
        cors: true
      }
    }
  ]
}
