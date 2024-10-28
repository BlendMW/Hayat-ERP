import { SabreClient } from '../../utils/sabreClient';
import { FlightSearchParams, StandardizedFlight, FlightStatus, Supplier } from './types';
import { logger } from '../../utils/logger';

export class SabreGdsManager {
  private sabreClient: SabreClient;
  private isAvailable: boolean;
  private supplier: Supplier;

  constructor() {
    this.sabreClient = new SabreClient();
    this.isAvailable = true;
    this.supplier = {
      id: 'sabre',
      name: 'Sabre GDS',
      type: 'GDS',
    };
  }

  async searchFlights(searchParams: FlightSearchParams): Promise<StandardizedFlight[]> {
    if (!this.isAvailable) {
      logger.warn('Sabre GDS is not available for flight search');
      return [];
    }
    try {
      const rawFlights = await this.sabreClient.searchFlights(searchParams);
      return this.standardizeFlights(rawFlights);
    } catch (error) {
      logger.error('Error searching flights in Sabre GDS', error as Error, { searchParams });
      throw error;
    }
  }

  async getFlightStatus(flightId: string): Promise<FlightStatus> {
    if (!this.isAvailable) {
      logger.warn('Sabre GDS is not available for flight status check');
      throw new Error('Sabre GDS is not available');
    }
    try {
      return await this.sabreClient.getFlightStatus(flightId);
    } catch (error) {
      logger.error('Error getting flight status from Sabre GDS', error as Error, { flightId });
      throw error;
    }
  }

  setAvailability(isAvailable: boolean): void {
    this.isAvailable = isAvailable;
    logger.info(`Sabre GDS availability set to ${isAvailable}`);
  }

  private standardizeFlights(rawFlights: any[]): StandardizedFlight[] {
    return rawFlights.map(flight => ({
      id: `sabre-${flight.id}`,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: new Date(flight.departureTime).toISOString(),
      arrivalTime: new Date(flight.arrivalTime).toISOString(),
      duration: this.calculateDuration(flight.departureTime, flight.arrivalTime),
      price: {
        amount: parseFloat(flight.price),
        currency: flight.currency || 'USD',
      },
      seatsAvailable: flight.seatsAvailable || 0,
      cabinClass: flight.cabinClass || 'economy',
      layovers: flight.layovers || [],
      flightClass: flight.flightClass || 'standard', // Default flightClass
      layoverDuration: flight.layoverDuration || '0h 0m', // Default layoverDuration
      stops: flight.stops || 0, // Default stops
      fareConditions: flight.fareConditions || 'Standard fare conditions', // Default fareConditions
      fareClasses: flight.fareClasses || ['Economy'], // Default fareClasses
      rules: {
        cancellation: flight.cancellationPolicy || 'No information available',
        changePolicy: flight.changePolicy || 'No information available',
        luggagePolicy: flight.luggagePolicy || 'No information available',
      },
      supplier: this.supplier,
    }));
  }

  private calculateDuration(departure: string | Date, arrival: string | Date): string {
    const durationMs = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}
