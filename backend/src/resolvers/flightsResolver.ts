import { FlightsModule } from '../modules/flights/flightsModule';
import { FlightSearchParams, UserPreference, SearchQuery, TenantFilterConfig, ScheduleChangeLog, APIConnection } from '../modules/flights/types';
import { UserPreferenceService } from '../services/hayatUserPreferenceService';
import { SearchQueryService } from '../services/searchQueryService';
import { TenantFilterConfigService } from '../services/hayatTenantFilterConfigService';
import { logger } from '../utils/logger';
import { FlightScheduleService } from '../services/hayatFlightScheduleService';
import { SeatInventoryService } from '../services/hayatSeatInventoryService';
import { IResolvers } from '@graphql-tools/utils';

interface Context {
    userId: string;
}

const flightsModule = new FlightsModule();
const userPreferenceService = new UserPreferenceService();
const searchQueryService = new SearchQueryService();
const tenantFilterConfigService = new TenantFilterConfigService();
const flightScheduleService = new FlightScheduleService();
const seatInventoryService = new SeatInventoryService();

export const flightsResolver: IResolvers<any, Context> = {
  Query: {
    searchFlights: async (_: any, { input }: { input: FlightSearchParams }) => {
      try {
        const searchParams: FlightSearchParams = {
          ...input,
          departureTimeRange: input.departureTimeRange ? {
            start: input.departureTimeRange.start,
            end: input.departureTimeRange.end
          } : undefined,
          arrivalTimeRange: input.arrivalTimeRange ? {
            start: input.arrivalTimeRange.start,
            end: input.arrivalTimeRange.end
          } : undefined,
          priceRange: input.priceRange ? {
            min: input.priceRange.min,
            max: input.priceRange.max
          } : undefined,
          userPreferences: input.userPreferences,
          currency: input.currency,
        };
        const flights = await flightsModule.searchFlights(searchParams);
        return flights;
      } catch (error) {
        logger.error('Error searching flights:', error);
        throw new Error('An error occurred while searching for flights');
      }
    },
    getUserPreferences: async (_: any, { userId }: { userId: string }) => {
      return userPreferenceService.getUserPreferences(userId);
    },
    getRecentSearchQueries: async (_: any, { userId, limit }: { userId: string; limit: number }) => {
      return searchQueryService.getRecentSearchQueries(userId, limit);
    },
    getRegisteredApis: () => {
      return flightsModule.getRegisteredApis();
    },
    getTenantFilterConfig: async (_: any, { tenantId }: { tenantId: string }) => {
      return tenantFilterConfigService.getFilterConfig(tenantId);
    },
    getFlightSchedule: async (_: any, { id }: { id: string }) => {
      return flightScheduleService.getFlightSchedule(id);
    },
    getSeatAvailability: async (_: any, { flightScheduleId, date }: { flightScheduleId: string; date: string }) => {
      return flightScheduleService.getSeatAvailability(flightScheduleId, date);
    },
    getSeatInventory: async (_: any, { flightId, fareClassCode }: { flightId: string; fareClassCode: string }) => {
      return seatInventoryService.getSeatInventory(flightId, fareClassCode);
    },
    getScheduleChangeLogs: async (_: any, { scheduleId }: { scheduleId: string }, { userId }: Context) => {
      return flightScheduleService.getScheduleChangeLogs(scheduleId);
    },
  },
  Mutation: {
    updateApiAvailability: async (_: any, { supplierId, isActive }: { supplierId: string; isActive: boolean }) => {
      try {
        flightsModule.updateApiAvailability(supplierId, isActive);
        return true;
      } catch (error) {
        console.error('Error updating API availability:', error);
        return false;
      }
    },
    updateApiPriority: async (_: any, { supplierId, priority }: { supplierId: string; priority: number }) => {
      try {
        flightsModule.updateApiPriority(supplierId, priority);
        return true;
      } catch (error) {
        console.error('Error updating API priority:', error);
        return false;
      }
    },
    registerApiConnection: async (_: any, { input }: { input: { supplierId: string; apiKey: string; baseUrl: string; isActive: boolean; priority: number } }) => {
      try {
        const connection: APIConnection = {
          id: `${input.supplierId}-connection`,
          supplier: { id: input.supplierId, name: '', type: 'AIRLINE' }, // You might want to fetch supplier details from a database
          apiKey: input.apiKey,
          baseUrl: input.baseUrl,
          isActive: input.isActive,
          priority: input.priority,
          endpoints: {}, // Add appropriate endpoints
          requestFormat: {}, // Add appropriate request format
          responseFormat: {}, // Add appropriate response format
          errorHandling: {}, // Add appropriate error handling
          supportsRealTimeUpdates: false, // Set this appropriately
        };
        flightsModule.registerApiConnection(connection);
        return true;
      } catch (error) {
        console.error('Error registering new API connection:', error);
        return false;
      }
    },
    updateUserPreferences: async (_: any, { userId, preferences }: { userId: string; preferences: UserPreference }) => {
      return userPreferenceService.updateUserPreferences(userId, preferences);
    },
    saveSearchQuery: async (_: any, { userId, query }: { userId: string; query: SearchQuery }) => {
      return searchQueryService.saveSearchQuery(userId, query);
    },
    updateTenantFilterConfig: async (_: any, { config }: { config: TenantFilterConfig }) => {
      await tenantFilterConfigService.updateFilterConfig(config);
      return tenantFilterConfigService.getFilterConfig(config.tenantId);
    },
    createOrUpdateFlightSchedule: async (_: any, { schedule }: { schedule: any }, { userId }: Context) => {
      await flightScheduleService.createOrUpdateFlightSchedule(schedule, userId);
      return schedule;
    },
    updateFareClasses: async (_: any, { flightScheduleId, fareClasses }: { flightScheduleId: string; fareClasses: any }) => {
      await flightScheduleService.updateFareClasses(flightScheduleId, fareClasses);
      return flightScheduleService.getFlightSchedule(flightScheduleId);
    },
    updateSeatAvailability: async (_: any, { flightScheduleId, date, availableSeats }: { flightScheduleId: string; date: string; availableSeats: number }) => {
      const availability = { flightScheduleId, date, availableSeats };
      await flightScheduleService.updateSeatAvailability(availability);
      return availability;
    },
    updateSeatInventory: async (_: any, { input }: { input: { flightId: string; fareClassCode: string; [key: string]: any } }) => {
      await flightScheduleService.updateSeatInventory(input.flightId, input.fareClassCode, input);
      return input;
    },
    deleteFlightSchedule: async (_: any, { scheduleId }: { scheduleId: string }, { userId }: Context) => {
      await flightScheduleService.deleteFlightSchedule(scheduleId, userId);
      return true;
    },
  },
};
