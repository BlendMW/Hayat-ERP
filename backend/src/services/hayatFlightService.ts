import { FlightProvider } from '../providers/flightProvider';

export const searchFlightsFromProvider = async (searchCriteria: any, tenant: string) => {
  const provider = new FlightProvider(tenant);
  return provider.searchFlights(searchCriteria);
};

export const getSeatMapFromProvider = async (flightId: string, tenant: string) => {
  const provider = new FlightProvider(tenant);
  return provider.getSeatMap(flightId);
};

export const getAddOnsFromProvider = async (flightId: string, tenant: string) => {
  const provider = new FlightProvider(tenant);
  return provider.getAddOns(flightId);
};
