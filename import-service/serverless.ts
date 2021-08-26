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
      BUCKET_NAME: { 'Ref': 'ImportUploadBucket' }
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
      }
    },
    Outputs: {
      ImportUploadBucketOutput: {
        Value: {
          Ref: 'ImportUploadBucket'
        }
      }
    }
  },
  // import the function via paths
  functions,
};

module.exports = serverlessConfiguration;
