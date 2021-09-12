import 'source-map-support/register';

import { SQSEvent, SQSRecord } from 'aws-lambda';
import { SQS, Lambda, SNS } from 'aws-sdk';

const lambda = new Lambda({
  region: process.env.AWS_REGION
});

const sqs = new SQS({
  region: process.env.AWS_REGION
});

const sns = new SNS({
  region: process.env.AWS_REGION
});

const processRecord = async (record: SQSRecord) => {
  const { body: product } = record;

  try {
    await lambda.invoke({
      // TODO: need a way to get this name from config/deployed service
      FunctionName: 'product-service-2-dev-createProduct',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers: {
          'Content-Type': 'application/json' // kicks bodyparser middleware ;)
        },
        body: product
      })
    }).promise();
  } catch (error) {
    console.error('Error occurred during adding a product ', product);
    console.error('Error: ', error?.toString());
    return;
  }

  try {
    await sns.publish({
      Message: `New product was created: ${product}`,
      MessageAttributes: {
        title: {
          DataType: 'String',
          StringValue: JSON.parse(product).title,
        }
      },
      TopicArn: process.env.TOPIC_ARN,
    }).promise();
  } catch (error) {
    console.error('Error occurred during sending a notification ');
    console.error('Error: ', error?.toString());
  }

  try {
    await sqs.deleteMessage({ QueueUrl: process.env.SQS_URL, ReceiptHandle: record.receiptHandle }).promise();
  } catch (error) {
    console.error('Error occurred during deleting a record from a queue: ', record);
    console.error('Error: ', error?.toString());
    return;
  }
};

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    console.log('catalogBatchProcess is called. Event:', event);

    for (const record of event.Records) {
      await processRecord(record);
    }

    console.log('catalogBatchProcess finishes');
  } catch (e) {
    console.log('Something went wrong. Error:', e);
  }
};

export const main = catalogBatchProcess;
