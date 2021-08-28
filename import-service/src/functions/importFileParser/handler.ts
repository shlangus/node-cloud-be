import 'source-map-support/register';

import { S3, SQS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

export const importFileParser = async (event: S3Event): Promise<number> => {
  try {
    console.log('importFileParser is called. Event:', event);
    const s3 = new S3({ region: process.env.AWS_REGION });
    const sqs = new SQS({ region: process.env.AWS_REGION });
    const bucket = process.env.BUCKET_NAME;

    if (!event?.Records?.length) {
      // Not sure how it is even possible to get here
      return 400;
    }

    const [record] = event.Records;
    const { key } = record.s3.object;

    console.log(`begin processing ${key}`);

    const stream = s3.getObject({
      Bucket: bucket,
      Key: key
    }).createReadStream().pipe(csv());

    for await (const data of stream) {
      console.log(data);
      try {
        await sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data)
        }).promise();
      } catch (e) {
        console.log('cannot send message', e?.toString());
      }
    }

    console.log(`finish processing ${key}`);

    await s3.copyObject({
      Bucket: bucket,
      CopySource: `${bucket}/${key}`,
      Key: key.replace('uploaded', 'parsed')
    }).promise();

    console.log(`copied ${key} to parsed`);

    await s3.deleteObject({
      Bucket: bucket,
      Key: key
    }).promise();

    console.log(`deleted ${key}`);

    return 200;
  } catch (e) {
    console.log('Something went wrong. Error:', e);
    return 500;
  }
};

export const main = importFileParser;
