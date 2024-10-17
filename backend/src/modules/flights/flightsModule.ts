import { AirlineApiManager } from './airlineApiManager';
import { SabreGdsManager } from './sabreGdsManager';
import { FlightInventoryManager } from './flightInventoryManager';
import { FlightSearchParams, StandardizedFlight, APIConnection } from './types';
import { apiConfigs } from './apiConfigs';
import { AdvancedSearchFilter } from './advancedSearchFilter';
import { CurrencyConversionService } from '../../services/currencyConversionService';
import { FlightScheduleService } from '../../services/flightScheduleService';

export class FlightsModule {
  private airlineApiManager: AirlineApiManager;
  private sabreGdsManager: SabreGdsManager;
  private flightInventoryManager: FlightInventoryManager;
  private currencyConversionService: CurrencyConversionService;
  private flightScheduleService: FlightScheduleService;

  constructor() {
    this.airlineApiManager = new AirlineApiManager();
    this.sabreGdsManager = new SabreGdsManager(apiConfigs.sabre);
    this.flightInventoryManager = new FlightInventoryManager();
    this.currencyConversionService = new CurrencyConversionService();
    this.flightScheduleService = new FlightScheduleService();

    // Register API connections
    Object.values(apiConfigs).forEach(config => {
      this.airlineApiManager.registerApi(config);
    });
  }

  async searchFlights(searchParams: FlightSearchParams): Promise<StandardizedFlight[]> {
    const airlineResults = await this.airlineApiManager.searchFlights(searchParams);
    const sabreResults = await this.sabreGdsManager.searchFlights(searchParams);
    
    const combinedResults = [...airlineResults, ...sabreResults];
    const processedFlights = await this.flightInventoryManager.processAndStoreFlights(combinedResults);
    
    // Apply advanced filtering
    const filteredFlights = AdvancedSearchFilter.filterFlights(processedFlights, searchParams);
    
    // Sort flights (you might want to add a sortBy parameter to searchParams)
    const sortedFlights = AdvancedSearchFilter.sortFlights(filteredFlights, searchParams.sortBy || 'price', searchParams.sortOrder || 'asc');
    
    if (searchParams.currency) {
      sortedFlights = await this.convertFlightPrices(sortedFlights, searchParams.currency);
    }

    const availabilityCheckedFlights = await Promise.all(
      sortedFlights.map(async (flight) => {
        const schedule = await this.flightScheduleService.getFlightSchedule(flight.id);
        const availability = await this.flightScheduleService.getSeatAvailability(flight.id, searchParams.departureDate);
        
        if (schedule && availability) {
          const updatedFareClasses = schedule.fareClasses.map(fareClass => ({
            ...fareClass,
            availableSeats: availability.availableSeats[fareClass.code] || 0,
          }));

          return {
            ...flight,
            fareClasses: updatedFareClasses,
          };
        }
        return flight;
      })
    );

    return availabilityCheckedFlights.filter(flight => flight.fareClasses.some(fc => fc.availableSeats > 0));
  }

  private async convertFlightPrices(flights: StandardizedFlight[], targetCurrency: string): Promise<StandardizedFlight[]> {
    return Promise.all(flights.map(async (flight) => {
      if (flight.price.currency.code !== targetCurrency) {
        const convertedAmount = await this.currencyConversionService.convertCurrency(
          flight.price.amount,
          flight.price.currency.code,
          targetCurrency
        );
        return {
          ...flight,
          price: {
            amount: convertedAmount,
            currency: { code: targetCurrency, symbol: this.getCurrencySymbol(targetCurrency) },
          },
        };
      }
      return flight;
    }));
  }

  private getCurrencySymbol(currencyCode: string): string {
    // Implement a mapping of currency codes to symbols
    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      // Add more currencies as needed
    };
    return currencySymbols[currencyCode] || currencyCode;
  }

  updateApiAvailability(supplierId: string, isActive: boolean): void {
    this.airlineApiManager.updateApiAvailability(supplierId, isActive);
  }

  updateApiPriority(supplierId: string, priority: number): void {
    this.airlineApiManager.updateApiPriority(supplierId, priority);
  }

  getRegisteredApis(): APIConnection[] {
    return this.airlineApiManager.getRegisteredApis();
  }

  registerApiConnection(connection: APIConnection): void {
    this.airlineApiManager.registerApi(connection);
  }

  // Add more methods for booking, cancellation, etc.
}
