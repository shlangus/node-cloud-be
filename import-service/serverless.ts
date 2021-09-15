import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET_NAME: { 'Ref': 'ImportUploadBucket' },
      SQS_URL: { 'Ref': 'CatalogItemsQueue' },
      TOPIC_ARN: { 'Ref': 'CreateProductTopic' },
    },
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 's3:ListBucket',
      Resource: [
        { 'Fn::Join': ['', ['arn:aws:s3:::', { 'Ref': 'ImportUploadBucket' }]] }
      ]
    }, {
      Effect: 'Allow',
      Action: 's3:*',
      Resource: [
        { 'Fn::Join': ['', ['arn:aws:s3:::', { 'Ref': 'ImportUploadBucket' }, '/*']] }
      ]
    }, {
      Effect: 'Allow',
      Action: 'sqs:SendMessage',
      Resource: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] }
    }, {
      Effect: 'Allow',
      Action: 'lambda:InvokeFunction',
      Resource: '*'
    }, {
      Effect: 'Allow',
      Action: 'sns:*',
      Resource: '*'
    }]
  },
  resources: {
    Resources: {
      ImportUploadBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:service}-file-import-upload-bucket',
          AccessControl: 'BucketOwnerFullControl',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT'],
                AllowedOrigins: ['*'],
                MaxAge: '3600',
                Id: 'CORSRule'
              }
            ]
          }
        }
      },
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      CreateProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'vbn-vbn15@yandex.ru',
          TopicArn: { 'Ref': 'CreateProductTopic' },
          Protocol: 'email'
        }
      },
      FilteredCreateProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'andrei_mitrofanov1@epam.com',
          TopicArn: { 'Ref': 'CreateProductTopic' },
          Protocol: 'email',
          FilterPolicy: {
            title: ['test', 'Test']
          }
        }
      },
      // https://github.com/serverless/serverless/issues/3896#issuecomment-333910525
      // https://www.serverless.com/blog/cors-api-gateway-survival-guide/#cors-with-custom-authorizers
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseType: 'DEFAULT_4XX',
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': `'*'`,
            'gatewayresponse.header.Access-Control-Allow-Headers': `'*'`
          },
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
        }
      }
    },
    Outputs: {
      ImportUploadBucketOutput: {
        Value: {
          Ref: 'ImportUploadBucket'
        }
      },
      CatalogItemsQueue: {
        Value: {
          Ref: 'CatalogItemsQueue'
        }
      },
      CreateProductTopic: {
        Value: {
          Ref: 'CreateProductTopic'
        }
      }
    }
  },
  // import the function via paths
  functions,
};

module.exports = serverlessConfiguration;
