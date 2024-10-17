import { DynamoDB } from 'aws-sdk';
import { StandardizedFlight } from './types';
import { logger } from '../utils/logger';

export class FlightInventoryManager {
  private dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async processAndStoreFlights(flights: StandardizedFlight[]): Promise<StandardizedFlight[]> {
    const processedFlights = this.deduplicateAndEnrichFlights(flights);
    await this.storeFlightsInDatabase(processedFlights);
    return processedFlights;
  }

  private deduplicateAndEnrichFlights(flights: StandardizedFlight[]): StandardizedFlight[] {
    // Remove duplicates based on flightNumber, origin, destination, and departureTime
    const uniqueFlights = Array.from(new Map(flights.map(flight => 
      [flight.flightNumber + flight.origin + flight.destination + flight.departureTime, flight]
    )).values());

    // Enrich flights with additional information if needed
    return uniqueFlights.map(flight => ({
      ...flight,
      // Add any additional enrichment here
    }));
  }

  private async storeFlightsInDatabase(flights: StandardizedFlight[]): Promise<void> {
    const putRequests = flights.map(flight => ({
      PutRequest: {
        Item: {
          ...flight,
          expirationTime: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Set TTL to 24 hours
        }
      }
    }));

    const params = {
      RequestItems: {
        [process.env.FLIGHTS_TABLE_NAME || 'Flights']: putRequests
      }
    };

    try {
      await this.dynamoDb.batchWrite(params).promise();
      logger.info(`Stored ${flights.length} flights in the database`);
    } catch (error) {
      logger.error('Error storing flights in the database', error as Error);
      throw error;
    }
  }
}
