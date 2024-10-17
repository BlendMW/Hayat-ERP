import { FlightsModule } from '../modules/flights/flightsModule';
import { FlightSearchParams, UserPreference, SearchQuery, TenantFilterConfig, ScheduleChangeLog } from '../modules/flights/types';
import { UserPreferenceService } from '../services/userPreferenceService';
import { SearchQueryService } from '../services/searchQueryService';
import { TenantFilterConfigService } from '../services/tenantFilterConfigService';
import { logger } from '../utils/logger';
import { FlightScheduleService } from '../services/flightScheduleService';
import { SeatInventoryService } from '../services/seatInventoryService';

const flightsModule = new FlightsModule();
const userPreferenceService = new UserPreferenceService();
const searchQueryService = new SearchQueryService();
const tenantFilterConfigService = new TenantFilterConfigService();
const flightScheduleService = new FlightScheduleService();
const seatInventoryService = new SeatInventoryService();

export const flightsResolver = {
  Query: {
    searchFlights: async (_, { input }) => {
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
    getUserPreferences: async (_, { userId }) => {
      return userPreferenceService.getUserPreferences(userId);
    },
    getRecentSearchQueries: async (_, { userId, limit }) => {
      return searchQueryService.getRecentSearchQueries(userId, limit);
    },
    getRegisteredApis: () => {
      return flightsModule.getRegisteredApis();
    },
    getTenantFilterConfig: async (_, { tenantId }) => {
      return tenantFilterConfigService.getFilterConfig(tenantId);
    },
    getFlightSchedule: async (_, { id }) => {
      return flightScheduleService.getFlightSchedule(id);
    },
    getSeatAvailability: async (_, { flightScheduleId, date }) => {
      return flightScheduleService.getSeatAvailability(flightScheduleId, date);
    },
    getSeatInventory: async (_, { flightId, fareClassCode }) => {
      return seatInventoryService.getSeatInventory(flightId, fareClassCode);
    },
    getScheduleChangeLogs: async (_, { scheduleId }, { userId }) => {
      return flightScheduleService.getScheduleChangeLogs(scheduleId);
    },
  },
  Mutation: {
    updateApiAvailability: async (_, { supplierId, isActive }) => {
      try {
        flightsModule.updateApiAvailability(supplierId, isActive);
        return true;
      } catch (error) {
        console.error('Error updating API availability:', error);
        return false;
      }
    },
    updateApiPriority: async (_, { supplierId, priority }) => {
      try {
        flightsModule.updateApiPriority(supplierId, priority);
        return true;
      } catch (error) {
        console.error('Error updating API priority:', error);
        return false;
      }
    },
    registerApiConnection: async (_, { input }) => {
      try {
        const connection = {
          id: `${input.supplierId}-connection`,
          supplier: { id: input.supplierId, name: '', type: 'AIRLINE' }, // You might want to fetch supplier details from a database
          apiKey: input.apiKey,
          baseUrl: input.baseUrl,
          isActive: input.isActive,
          priority: input.priority,
        };
        flightsModule.registerApiConnection(connection);
        return true;
      } catch (error) {
        console.error('Error registering new API connection:', error);
        return false;
      }
    },
    updateUserPreferences: async (_, { userId, preferences }) => {
      return userPreferenceService.updateUserPreferences(userId, preferences);
    },
    saveSearchQuery: async (_, { userId, query }) => {
      return searchQueryService.saveSearchQuery(userId, query);
    },
    updateTenantFilterConfig: async (_, { config }) => {
      await tenantFilterConfigService.updateFilterConfig(config);
      return tenantFilterConfigService.getFilterConfig(config.tenantId);
    },
    createOrUpdateFlightSchedule: async (_, { schedule }, { userId }) => {
      await flightScheduleService.createOrUpdateFlightSchedule(schedule, userId);
      return schedule;
    },
    updateFareClasses: async (_, { flightScheduleId, fareClasses }) => {
      await flightScheduleService.updateFareClasses(flightScheduleId, fareClasses);
      return flightScheduleService.getFlightSchedule(flightScheduleId);
    },
    updateSeatAvailability: async (_, { flightScheduleId, date, availableSeats }) => {
      const availability = { flightScheduleId, date, availableSeats };
      await flightScheduleService.updateSeatAvailability(availability);
      return availability;
    },
    updateSeatInventory: async (_, { input }) => {
      await flightScheduleService.updateSeatInventory(input.flightId, input.fareClassCode, input);
      return input;
    },
    deleteFlightSchedule: async (_, { scheduleId }, { userId }) => {
      await flightScheduleService.deleteFlightSchedule(scheduleId, userId);
      return true;
    },
  },
};
