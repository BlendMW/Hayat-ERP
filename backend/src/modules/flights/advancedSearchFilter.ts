import { StandardizedFlight, FlightSearchParams, TimeRange, UserPreference, TenantFilterConfig, CustomFilter } from './types';
import { TenantFilterConfigService } from '../services/tenantFilterConfigService';

export class AdvancedSearchFilter {
  private static tenantFilterConfigService = new TenantFilterConfigService();

  static async filterFlights(flights: StandardizedFlight[], params: FlightSearchParams): Promise<StandardizedFlight[]> {
    const tenantConfig = await this.tenantFilterConfigService.getFilterConfig(params.tenantId);
    
    return flights.filter(flight => {
      for (const filterName of tenantConfig.enabledFilters) {
        if (!this.applyFilter(flight, params, filterName)) return false;
      }

      for (const customFilter of tenantConfig.customFilters) {
        if (!this.applyCustomFilter(flight, params, customFilter)) return false;
      }

      return true;
    });
  }

  private static applyFilter(flight: StandardizedFlight, params: FlightSearchParams, filterName: string): boolean {
    switch (filterName) {
      case 'flightClass':
        return !params.flightClass || params.flightClass.includes(flight.flightClass);
      case 'priceRange':
        return !params.priceRange || (flight.price.amount >= params.priceRange.min && flight.price.amount <= params.priceRange.max);
      case 'departureTimeRange':
        return !params.departureTimeRange || this.isTimeInRange(flight.departureTime, params.departureTimeRange);
      case 'arrivalTimeRange':
        return !params.arrivalTimeRange || this.isTimeInRange(flight.arrivalTime, params.arrivalTimeRange);
      case 'airlines':
        return !params.airlines || params.airlines.includes(flight.airline);
      case 'maxLayoverDuration':
        return params.maxLayoverDuration === undefined || flight.layoverDuration <= params.maxLayoverDuration;
      case 'maxStops':
        return params.maxStops === undefined || flight.stops <= params.maxStops;
      case 'fareConditions':
        return !params.fareConditions || params.fareConditions.some(condition => flight.fareConditions.includes(condition));
      default:
        return true;
    }
  }

  private static applyCustomFilter(flight: StandardizedFlight, params: FlightSearchParams, customFilter: CustomFilter): boolean {
    const filterValue = params.customFilters?.[customFilter.name];
    if (filterValue === undefined) return true;

    switch (customFilter.type) {
      case 'select':
        return (flight as any)[customFilter.name] === filterValue;
      case 'range':
        const value = (flight as any)[customFilter.name];
        return value >= filterValue.min && value <= filterValue.max;
      case 'boolean':
        return (flight as any)[customFilter.name] === filterValue;
      default:
        return true;
    }
  }

  private static matchesUserPreferences(flight: StandardizedFlight, preferences: UserPreference): boolean {
    if (preferences.preferredAirlines.length > 0 && !preferences.preferredAirlines.includes(flight.airline)) return false;
    if (preferences.preferredCabinClass.length > 0 && !preferences.preferredCabinClass.includes(flight.cabinClass)) return false;
    if (flight.price.amount > preferences.maxPrice) return false;
    if (flight.stops > preferences.maxStops) return false;
    if (!this.isTimeInRange(flight.departureTime, preferences.preferredDepartureTimeRange)) return false;
    if (!this.isTimeInRange(flight.arrivalTime, preferences.preferredArrivalTimeRange)) return false;

    return true;
  }

  private static calculateRelevanceScores(flights: StandardizedFlight[], params: FlightSearchParams): StandardizedFlight[] {
    return flights.map(flight => {
      let score = 100; // Base score

      // Adjust score based on user preferences
      if (params.userPreferences) {
        if (params.userPreferences.preferredAirlines.includes(flight.airline)) score += 10;
        if (params.userPreferences.preferredCabinClass.includes(flight.cabinClass)) score += 10;
        score -= (flight.price.amount / params.userPreferences.maxPrice) * 20; // Lower score for higher prices
        score -= flight.stops * 5; // Lower score for more stops
      }

      // Adjust score based on price (lower price = higher score)
      const averagePrice = flights.reduce((sum, f) => sum + f.price.amount, 0) / flights.length;
      score += ((averagePrice - flight.price.amount) / averagePrice) * 20;

      return { ...flight, relevanceScore: Math.max(0, Math.min(100, score)) };
    });
  }

  private static isTimeInRange(time: string, range: TimeRange): boolean {
    const flightTime = time.split('T')[1].substring(0, 5); // Extract HH:mm from ISO string
    return flightTime >= range.start && flightTime <= range.end;
  }

  static sortFlights(flights: StandardizedFlight[], sortBy: string, order: 'asc' | 'desc'): StandardizedFlight[] {
    return flights.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'relevance':
          comparison = (b.relevanceScore || 0) - (a.relevanceScore || 0);
          break;
        case 'price':
          comparison = a.price.amount - b.price.amount;
          break;
        case 'duration':
          comparison = this.getDurationInMinutes(a.duration) - this.getDurationInMinutes(b.duration);
          break;
        case 'departureTime':
          comparison = new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
          break;
        case 'arrivalTime':
          comparison = new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
          break;
        default:
          return 0;
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }

  private static getDurationInMinutes(duration: string): number {
    const [hours, minutes] = duration.split('h ');
    return parseInt(hours) * 60 + parseInt(minutes);
  }
}
