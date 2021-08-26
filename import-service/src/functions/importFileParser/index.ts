import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: { 'Ref': 'ImportUploadBucket' },
        event: 's3:ObjectCreated:Put',
        prefix: 'uploaded',
        existing: true
      }
    }
  ]
};


