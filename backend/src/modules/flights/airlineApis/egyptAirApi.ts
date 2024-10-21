import { AirlineApi } from './airlineApi';
import { APIConnection, FlightSearchParams, FlightStatus } from '../types';
import axios from 'axios';
import { logger } from '../../utils/logger';

export class EgyptAirApi implements AirlineApi {
  constructor(private connection: APIConnection) {}

  async searchFlights(params: FlightSearchParams): Promise<any[]> {
    try {
      const response = await axios.post(
        `${this.connection.baseUrl}${this.connection.endpoints.search}`,
        params,
        {
          headers: {
            'Authorization': `Bearer ${this.connection.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Error searching flights with EgyptAir API', error as Error, { params });
      throw error;
    }
  }

  async getFlightStatus(flightId: string): Promise<FlightStatus> {
    try {
      const response = await axios.get(
        `${this.connection.baseUrl}${this.connection.endpoints.status}/${flightId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.connection.apiKey}`,
          },
        }
      );
      return this.mapToFlightStatus(response.data);
    } catch (error) {
      logger.error('Error getting flight status from EgyptAir API', error as Error, { flightId });
      throw error;
    }
  }

  private mapToFlightStatus(data: any): FlightStatus {
    // Implement mapping logic from EgyptAir API response to FlightStatus
    return {
      flightId: data.flightId,
      status: data.status,
      // ... map other fields
    };
  }
}
