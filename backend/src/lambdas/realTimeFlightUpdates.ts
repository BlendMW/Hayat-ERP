import { APIGatewayProxyHandler } from 'aws-lambda';
import { FlightScheduleService } from '../services/flightScheduleService';
import { logger } from '../utils/logger';

const flightScheduleService = new FlightScheduleService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    
    if (body.type === 'SCHEDULE_UPDATE') {
      await flightScheduleService.createOrUpdateFlightSchedule(body.schedule);
    } else if (body.type === 'AVAILABILITY_UPDATE') {
      await flightScheduleService.updateSeatAvailability(body.availability);
    } else {
      throw new Error('Invalid update type');
    }

    logger.info('Real-time flight update processed successfully', { updateType: body.type });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Update processed successfully' }),
    };
  } catch (error) {
    logger.error('Error processing real-time flight update', error as Error, { event });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing update' }),
    };
  }
};
