import { DynamoDB } from 'aws-sdk';
import { FlightStatus } from '../modules/flights/types';
import { logger } from '../utils/logger';

export class FlightStatusUpdateService {
  private dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async processUpdate(update: FlightStatus): Promise<void> {
    const params = {
      TableName: process.env.FLIGHT_STATUS_TABLE_NAME || 'FlightStatus',
      Item: {
        updatedAt: new Date().toISOString(),
        ...update,
      },
    };

    try {
      await this.dynamoDb.put(params).promise();
      logger.info('Flight status updated in DynamoDB', { flightId: update.flightId, status: update.status });
    } catch (error) {
      logger.error('Error updating flight status in DynamoDB', error as Error, { update });
      throw error;
    }
    
    // TODO: Implement notification logic (e.g., push notifications, emails)
  }
}
