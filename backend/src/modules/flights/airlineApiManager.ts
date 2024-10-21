import { ApiFactory } from './apiFactory';
import { StandardizedFlight, RawFlight, FlightSearchParams, FlightStatus, APIConnection, Supplier } from './types';
import { logger } from '../utils/logger';
import { apiConfigs } from './apiConfigs';
import { AirlineApi } from './airlineApis/airlineApi';
import { IraqiAirwaysApi } from './airlineApis/iraqiAirwaysApi';
import { AirArabiaApi } from './airlineApis/airArabiaApi';
import { QatarAirwaysApi } from './airlineApis/qatarAirwaysApi';
import { RoyalJordanianApi } from './airlineApis/royalJordanianApi';
import { EgyptAirApi } from './airlineApis/egyptAirApi';
import { MiddleEastAirlinesApi } from './airlineApis/middleEastAirlinesApi';
import { TurkishAirlinesApi } from './airlineApis/turkishAirlinesApi';
import { UrAirlinesApi } from './airlineApis/urAirlinesApi';
import { SabreApi } from './airlineApis/sabreApi';

export class AirlineApiManager {
  private apiConnections: Map<string, APIConnection>;

  constructor() {
    this.apiConnections = new Map(Object.entries(apiConfigs));
  }

  registerApi(connection: APIConnection): void {
    this.apiConnections.set(connection.supplier.id, connection);
    logger.info(`Registered API for ${connection.supplier.name}`, { supplierId: connection.supplier.id });
  }

  async searchFlights(searchParams: FlightSearchParams): Promise<StandardizedFlight[]> {
    const availableApis = Array.from(this.apiConnections.values())
      .filter(connection => connection.isActive)
      .sort((a, b) => a.priority - b.priority);

    logger.info(`Searching flights with ${availableApis.length} active APIs`, { searchParams });

    const searchPromises = availableApis.map(connection => 
      ApiFactory.createApiInstance(connection).searchFlights(searchParams)
        .then(flights => this.standardizeFlights(flights, connection.supplier))
        .catch(error => {
          logger.error(`Error searching flights for ${connection.supplier.name}`, error as Error);
          return [];
        })
    );

    const results = await Promise.all(searchPromises);
    return results.flat();
  }

  private standardizeFlights(flights: any[], supplier: Supplier): StandardizedFlight[] {
    return flights.map(flight => ({
      id: `${supplier.id}-${flight.id || Math.random().toString(36).substr(2, 9)}`,
      airline: flight.airline || supplier.name,
      flightNumber: flight.flightNumber || 'N/A',
      origin: flight.origin,
      destination: flight.destination,
      departureTime: new Date(flight.departureTime).toISOString(),
      arrivalTime: new Date(flight.arrivalTime).toISOString(),
      duration: this.calculateDuration(flight.departureTime, flight.arrivalTime),
      price: {
        amount: parseFloat(flight.price.toString()),
        currency: flight.currency || 'USD',
      },
      seatsAvailable: flight.seatsAvailable || 0,
      cabinClass: flight.cabinClass || 'economy',
      layovers: flight.layovers || [],
      rules: {
        cancellation: flight.cancellationPolicy || 'No information available',
        changePolicy: flight.changePolicy || 'No information available',
        luggagePolicy: flight.luggagePolicy || 'No information available',
      },
      supplier: supplier,
    }));
  }

  private calculateDuration(departure: string | Date, arrival: string | Date): string {
    const durationMs = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  updateApiAvailability(supplierId: string, isActive: boolean): void {
    const connection = this.apiConnections.get(supplierId);
    if (connection) {
      connection.isActive = isActive;
      this.apiConnections.set(supplierId, connection);
      logger.info(`Updated API availability for ${connection.supplier.name}`, { supplierId, isActive });
    } else {
      logger.warn(`Attempted to update availability for non-existent API`, { supplierId });
    }
  }

  updateApiPriority(supplierId: string, priority: number): void {
    const connection = this.apiConnections.get(supplierId);
    if (connection) {
      connection.priority = priority;
      this.apiConnections.set(supplierId, connection);
      logger.info(`Updated API priority for ${connection.supplier.name}`, { supplierId, priority });
    } else {
      logger.warn(`Attempted to update priority for non-existent API`, { supplierId });
    }
  }

  getRegisteredApis(): APIConnection[] {
    return Array.from(this.apiConnections.values());
  }

  async getFlightStatus(flightId: string): Promise<FlightStatus> {
    const [supplierId] = flightId.split('-');
    const connection = this.apiConnections.get(supplierId);

    if (!connection || !connection.isActive) {
      logger.warn(`Attempted to get flight status from inactive or non-existent API`, { flightId, supplierId });
      throw new Error(`API for supplier ${supplierId} is not available or not found`);
    }

    try {
      const status = await ApiFactory.createApiInstance(connection).getFlightStatus(flightId);
      logger.info(`Retrieved flight status`, { flightId, status });
      return status;
    } catch (error) {
      logger.error(`Error getting flight status`, error as Error, { flightId, supplierId });
      throw error;
    }
  }
}
