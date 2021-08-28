import { catalogBatchProcess } from './handler';
import { SQSEvent } from 'aws-lambda';
import { Lambda as LambdaMock, SNS as SNSMock, SQS as SQSMock } from '../../__mocks__/aws-sdk';

describe('catalogBatchProcess', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    LambdaMock.mockInvoke(jest.fn());
    SNSMock.mockPublish(jest.fn());
    SQSMock.mockDeleteMessage(jest.fn());
  })

  // for sake of time let's use some dirty hacks
  const makeEvent = <T>(params: T): SQSEvent => ({
    Records: [{
      body: JSON.stringify(params),
      receiptHandle: 'receiptHandle'
    }]
  }) as unknown as SQSEvent;

  it('should invoke underlying lambda', async () => {
    expect.assertions(1);
    const mock = jest.fn();
    LambdaMock.mockInvoke(mock);
    const event = makeEvent({
      title: '1234'
    });

    await catalogBatchProcess(event);

    expect(mock).toBeCalled();
  });

  it('should publish to sns topic', async () => {
    expect.assertions(1);
    const mock = jest.fn();
    SNSMock.mockPublish(mock);
    const event = makeEvent({
      title: '1234'
    });

    await catalogBatchProcess(event);

    expect(mock).toBeCalled();
  });

  it('should remove a message after processing', async () => {
    expect.assertions(1);
    const mock = jest.fn();
    SQSMock.mockDeleteMessage(mock);
    const event = makeEvent({
      title: '1234'
    });

    await catalogBatchProcess(event);

    expect(mock).toBeCalled();
  });
});
