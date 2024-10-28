import { DynamoDB } from 'aws-sdk';
import { AirlineApiManager } from '../modules/flights/airlineApiManager';
import { FlightStatusUpdateService } from './hayatFlightStatusUpdateService';
import { FlightStatus } from '../modules/flights/types';
import { logger } from '../utils/logger';

export class FlightStatusPollingService {
  private dynamoDb: DynamoDB.DocumentClient;
  private airlineApiManager: AirlineApiManager;
  private flightStatusUpdateService: FlightStatusUpdateService;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
    this.airlineApiManager = new AirlineApiManager();
    this.flightStatusUpdateService = new FlightStatusUpdateService();
  }

  async pollAllActiveFlights(): Promise<void> {
    const activeFlights = await this.getActiveFlights();
    logger.info(`Polling ${activeFlights.length} active flights`);

    for (const flight of activeFlights) {
      try {
        const status = await this.airlineApiManager.getFlightStatus(flight.flightId);
        await this.flightStatusUpdateService.processUpdate(status);
        logger.info('Flight status updated', { flightId: flight.flightId, status: status.status });
      } catch (error) {
        logger.error('Error updating flight status', error as Error, { flightId: flight.flightId });
      }
    }
  }

  private async getActiveFlights(): Promise<{ flightId: string }[]> {
    const params = {
      TableName: process.env.ACTIVE_FLIGHTS_TABLE_NAME || 'ActiveFlights',
      // Add any necessary query parameters
    };

    try {
      const result = await this.dynamoDb.scan(params).promise();
      return result.Items as { flightId: string }[];
    } catch (error) {
      logger.error('Error fetching active flights', error as Error);
      throw error;
    }
  }
}
