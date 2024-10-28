import { APIGatewayProxyHandler } from 'aws-lambda';
import { SeatInventoryService } from '../services/hayatSeatInventoryService';
import { BookingEvent } from '../modules/flights/types';
import { logger } from '../utils/logger';

const seatInventoryService = new SeatInventoryService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const bookingEvent: BookingEvent = JSON.parse(event.body || '{}');
    await seatInventoryService.processBookingEvent(bookingEvent);

    logger.info('Real-time seat inventory update processed successfully', { bookingEvent });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Seat inventory update processed successfully' }),
    };
  } catch (error) {
    logger.error('Error processing real-time seat inventory update', error as Error, { event });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing seat inventory update' }),
    };
  }
};
