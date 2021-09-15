import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  useDotenv: true,
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions,
};

module.exports = serverlessConfiguration;
