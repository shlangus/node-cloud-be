import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          // TODO: get back here https://serverless-stack.com/chapters/cross-stack-references-in-serverless.html
          arn: {
            'Fn::Join': [':', [
              'arn:aws:lambda',
              { 'Ref': 'AWS::Region' },
              { 'Ref': 'AWS::AccountId' },
              'function:authorization-service-dev-basicAuthorizer'
            ]] as any
          },
          name: 'basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        }
      }
    }
  ]
};
