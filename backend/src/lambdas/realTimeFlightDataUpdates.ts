import { SQSHandler, SQSEvent, SQSRecord } from 'aws-lambda';
import { FlightScheduleService } from '../services/flightScheduleService';
import { SeatInventoryService } from '../services/seatInventoryService';
import { logger } from '../utils/logger';

const flightScheduleService = new FlightScheduleService();
const seatInventoryService = new SeatInventoryService();

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    await processMessage(record);
  }
};

async function processMessage(record: SQSRecord): Promise<void> {
  try {
    const message = JSON.parse(record.body);
    logger.info('Processing real-time flight data update', { messageId: record.messageId });

    switch (message.type) {
      case 'FLIGHT_SCHEDULE_UPDATE':
        await flightScheduleService.createOrUpdateFlightSchedule(message.data);
        break;
      case 'SEAT_INVENTORY_UPDATE':
        await seatInventoryService.updateSeatInventory(
          message.data.flightId,
          message.data.fareClassCode,
          message.data.seatInventory
        );
        break;
      case 'FARE_CLASS_UPDATE':
        await flightScheduleService.updateFareClasses(message.data.flightScheduleId, message.data.fareClasses);
        break;
      default:
        logger.warn('Unknown message type received', { type: message.type, messageId: record.messageId });
    }

    logger.info('Successfully processed flight data update', { messageId: record.messageId });
  } catch (error) {
    logger.error('Error processing flight data update', error as Error, { messageId: record.messageId });
    throw error; // Throwing the error will cause the message to be retried
  }
}
