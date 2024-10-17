import { APIGatewayProxyHandler } from 'aws-lambda';
import { FlightStatusUpdateService } from '../services/flightStatusUpdateService';
import { logger } from '../utils/logger';

export const handler: APIGatewayProxyHandler = async (event) => {
  const flightStatusUpdateService = new FlightStatusUpdateService();

  try {
    const body = JSON.parse(event.body || '{}');
    await flightStatusUpdateService.processUpdate(body);

    logger.info('Flight status update processed successfully', { flightId: body.flightId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Flight status update processed successfully' }),
    };
  } catch (error) {
    logger.error('Error processing flight status update', error as Error, { event });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing flight status update' }),
    };
  }
};
