import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';
import documentation from './serverless.doc';

const serverlessConfiguration: AWS = {
  service: 'product-service-2', // Since I'm a bit ahead of schedule let's deploy this as a new app
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    // serverless-openapi-documentation
    documentation
  },
  useDotenv: true,
  plugins: ['serverless-webpack', 'serverless-openapi-documentation'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST: '${env:DB_HOST}',
      DB_DATABASE: '${env:DB_DATABASE}',
      DB_USER: '${env:DB_USER}',
      DB_PASSWORD: '${env:DB_PASSWORD}'
    },
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions,
};

module.exports = serverlessConfiguration;
