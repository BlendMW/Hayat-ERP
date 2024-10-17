import { FlightSearchParams, RawFlight, FlightStatus } from '../types';

export interface AirlineApi {
  searchFlights(params: FlightSearchParams): Promise<RawFlight[]>;
  getFlightStatus(flightId: string): Promise<FlightStatus>;
}
