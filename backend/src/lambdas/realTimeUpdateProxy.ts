import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import { logger } from '../utils/logger';

const sqs = new SQS();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    
    const params = {
      MessageBody: JSON.stringify(body),
      QueueUrl: process.env.SQS_QUEUE_URL!,
    };

    await sqs.sendMessage(params).promise();

    logger.info('Successfully sent message to SQS', { messageBody: body });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Update received and queued for processing' }),
    };
  } catch (error) {
    logger.error('Error processing real-time update', error as Error, { event });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing update' }),
    };
  }
};
