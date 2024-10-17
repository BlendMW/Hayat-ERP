import { ScheduledHandler } from 'aws-lambda';
import { FlightStatusPollingService } from '../services/flightStatusPollingService';
import { logger } from '../utils/logger';

export const handler: ScheduledHandler = async () => {
  const flightStatusPollingService = new FlightStatusPollingService();

  try {
    await flightStatusPollingService.pollAllActiveFlights();
    logger.info('Flight status polling completed successfully');
  } catch (error) {
    logger.error('Error during flight status polling', error as Error);
    throw error;
  }
};
