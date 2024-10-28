export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: string;
  // Fields for advanced filtering
  minPrice?: number;
  maxPrice?: number;
  airlines?: string[];
  departureTimeRange?: TimeRange;
  arrivalTimeRange?: TimeRange;
  maxStops?: number;
  preferredAirlines?: string[];
  // Fields for dynamic filters
  flightClass?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  maxLayoverDuration?: number; // in minutes
  fareConditions?: string[];
  userPreferences?: UserPreference;
  tenantId: string;
  customFilters?: Record<string, any>;
  currency?: string; // Preferred currency for results
}

export interface RawFlight {
  id?: string;
  airline?: string;
  flightNumber?: string;
  origin: string;
  destination: string;
  departureTime: string | Date;
  arrivalTime: string | Date;
  price: number | string;
  currency?: string;
  seatsAvailable?: number;
  cabinClass?: string;
  layovers?: string[];
  cancellationPolicy?: string;
  changePolicy?: string;
  luggagePolicy?: string;
}

export interface StandardizedFlight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: {
    amount: number;
    currency: CurrencyInfo;
  };
  seatsAvailable: number;
  cabinClass: string;
  layovers: string[];
  rules: {
    cancellation: string;
    changePolicy: string;
    luggagePolicy: string;
  };
  // New fields to support advanced filtering
  flightClass: string;
  layoverDuration: number; // in minutes
  stops: number;
  fareConditions: string[];
  fareClasses: FareClass[];
}

export interface FlightStatus {
  flightId: string;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
  departureTime?: string;
  arrivalTime?: string;
  gate?: string;
  terminal?: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: {
    amount: number;
    currency: CurrencyInfo;
  };
  seatsAvailable: number;
  cabinClass: string;
  layovers: string[];
  rules: {
    cancellation: string;
    changePolicy: string;
    luggagePolicy: string;
  };
  supplier: Supplier;
  relevanceScore?: number;
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export interface Supplier {
  id: string;
  name: string;
  type: 'AIRLINE' | 'GDS' | 'OTA';
}

export interface APIConnection {
  id: string;
  supplier: Supplier;
  apiKey: string;
  baseUrl: string;
  isActive: boolean;
  priority: number;
  endpoints: {
    search: string;
    status: string;
    booking: string;
  };
  requestFormat: 'JSON' | 'XML' | 'SOAP';
  responseFormat: 'JSON' | 'XML';
  errorHandling: {
    retryAttempts: number;
    retryDelay: number; // in milliseconds
  };
  supportsRealTimeUpdates: boolean;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface UserPreference {
  id: string;
  userId: string;
  preferredAirlines: string[];
  preferredCabinClass: string[];
  maxPrice: number;
  maxStops: number;
  preferredDepartureTimeRange: TimeRange;
  preferredArrivalTimeRange: TimeRange;
}

export interface SearchQuery {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: string;
  additionalFilters: Partial<FlightSearchParams>;
}

export interface TenantFilterConfig {
  id: string;
  tenantId: string;
  enabledFilters: string[];
  customFilters: CustomFilter[];
}

export interface CustomFilter {
  name: string;
  type: 'select' | 'range' | 'boolean';
  options?: string[]; // For select type
  min?: number; // For range type
  max?: number; // For range type
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
}

export interface FlightSchedule {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string[]; // e.g., ['DAILY', 'EXCEPT_TUE']
  effectiveFrom: string;
  effectiveTo: string;
  aircraft: string;
  seatsAvailable: number;
  fareClasses: FareClass[];
  seatInventory: SeatInventory[];
}

export interface SeatInventory {
  flightId: string;
  fareClassCode: string;
  availableSeats: number;
  seatMap: SeatMap;
}

export interface SeatMap {
  rows: SeatRow[];
}

export interface SeatRow {
  rowNumber: number;
  seats: Seat[];
}

export interface Seat {
  seatNumber: string;
  isAvailable: boolean;
  isExit: boolean;
  isWindow: boolean;
  isAisle: boolean;
}

export interface SeatAvailability {
  flightScheduleId: string;
  date: string;
  availableSeats: {
    [fareClassCode: string]: number;
  };
}

export interface FareClass {
  id: string;
  name: string;
  code: string;
  benefits: string[];
  rules: FareRules;
  price: number;
  availableSeats: number;
  seatInventory: SeatInventory;
}

export interface FareRules {
  cancellation: string;
  change: string;
  baggage: string;
  seatSelection: string;
  mealSelection: string;
}

export interface BookingEvent {
  type: 'BOOKING' | 'CANCELLATION';
  flightId: string;
  fareClassCode: string;
  seats: string[];
}

export interface ScheduleChangeLog {
  id: string;
  flightScheduleId: string;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE';
  changedFields: string[];
  oldValue: Partial<FlightSchedule>;
  newValue: Partial<FlightSchedule>;
  timestamp: string;
  userId: string;
}
