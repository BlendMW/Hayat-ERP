import { APIGatewayProxyHandler } from 'aws-lambda';
import { FlightScheduleService } from '../services/hayatFlightScheduleService';
import { logger } from '../utils/logger';

const flightScheduleService = new FlightScheduleService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    
    if (body.type === 'FARE_CLASS_UPDATE') {
      await flightScheduleService.updateFareClasses(body.flightScheduleId, body.fareClasses);
    } else if (body.type === 'SEAT_AVAILABILITY_UPDATE') {
      await flightScheduleService.updateSeatAvailability(body.availability);
    } else {
      throw new Error('Invalid update type');
    }

    logger.info('Real-time fare class update processed successfully', { updateType: body.type });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Update processed successfully' }),
    };
  } catch (error) {
    logger.error('Error processing real-time fare class update', error as Error, { event });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing update' }),
    };
  }
};
