import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { formatJSONError, formatJSONResult } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

export const importProductsFile = async ({ queryStringParameters }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('importProductsFile is called. Parameters:', queryStringParameters);
    const s3 = new S3({ region: process.env.AWS_REGION });
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.BUCKET_NAME,
      ContentType: 'text/csv',
      Key: `uploaded/${queryStringParameters.name}`
    });

    return formatJSONResult(url);
  } catch (e) {
    console.error(e);
    return formatJSONError({
      message: `Something went wrong`,
    });
  }
};

export const main = middyfy(importProductsFile);
