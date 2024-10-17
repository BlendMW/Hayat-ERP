import { APIConnection, Supplier } from './types';

const iraqiAirwaysSupplier: Supplier = { id: 'iraqi-airways', name: 'Iraqi Airways', type: 'AIRLINE' };
const airArabiaSupplier: Supplier = { id: 'air-arabia', name: 'Air Arabia', type: 'AIRLINE' };
const qatarAirwaysSupplier: Supplier = { id: 'qatar-airways', name: 'Qatar Airways', type: 'AIRLINE' };
const royalJordanianSupplier: Supplier = { id: 'royal-jordanian', name: 'Royal Jordanian', type: 'AIRLINE' };
const egyptAirSupplier: Supplier = { id: 'egyptair', name: 'EgyptAir', type: 'AIRLINE' };
const middleEastAirlinesSupplier: Supplier = { id: 'middle-east-airlines', name: 'Middle East Airlines', type: 'AIRLINE' };
const turkishAirlinesSupplier: Supplier = { id: 'turkish-airlines', name: 'Turkish Airlines', type: 'AIRLINE' };
const urAirlinesSupplier: Supplier = { id: 'ur-airlines', name: 'Ur Airlines', type: 'AIRLINE' };
const sabreSupplier: Supplier = { id: 'sabre', name: 'Sabre GDS', type: 'GDS' };

export const apiConfigs: Record<string, APIConnection> = {
  iraqiAirways: {
    id: 'iraqi-airways-connection',
    supplier: iraqiAirwaysSupplier,
    apiKey: process.env.IRAQI_AIRWAYS_API_KEY || 'your-iraqi-airways-api-key',
    baseUrl: 'https://api.iraqiairways.com/v1',
    isActive: true,
    priority: 1,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  airArabia: {
    id: 'air-arabia-connection',
    supplier: airArabiaSupplier,
    apiKey: process.env.AIR_ARABIA_API_KEY || 'your-air-arabia-api-key',
    baseUrl: 'https://api.airarabia.com/v1',
    isActive: true,
    priority: 2,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  qatarAirways: {
    id: 'qatar-airways-connection',
    supplier: qatarAirwaysSupplier,
    apiKey: process.env.QATAR_AIRWAYS_API_KEY || 'your-qatar-airways-api-key',
    baseUrl: 'https://api.qatarairways.com/v1',
    isActive: true,
    priority: 3,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  royalJordanian: {
    id: 'royal-jordanian-connection',
    supplier: royalJordanianSupplier,
    apiKey: process.env.ROYAL_JORDANIAN_API_KEY || 'your-royal-jordanian-api-key',
    baseUrl: 'https://api.rj.com/v1',
    isActive: true,
    priority: 4,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  egyptAir: {
    id: 'egyptair-connection',
    supplier: egyptAirSupplier,
    apiKey: process.env.EGYPTAIR_API_KEY || 'your-egyptair-api-key',
    baseUrl: 'https://api.egyptair.com/v1',
    isActive: true,
    priority: 5,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  middleEastAirlines: {
    id: 'middle-east-airlines-connection',
    supplier: middleEastAirlinesSupplier,
    apiKey: process.env.MIDDLE_EAST_AIRLINES_API_KEY || 'your-middle-east-airlines-api-key',
    baseUrl: 'https://api.mea.com.lb/v1',
    isActive: true,
    priority: 6,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  turkishAirlines: {
    id: 'turkish-airlines-connection',
    supplier: turkishAirlinesSupplier,
    apiKey: process.env.TURKISH_AIRLINES_API_KEY || 'your-turkish-airlines-api-key',
    baseUrl: 'https://api.turkishairlines.com/v1',
    isActive: true,
    priority: 7,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  urAirlines: {
    id: 'ur-airlines-connection',
    supplier: urAirlinesSupplier,
    apiKey: process.env.UR_AIRLINES_API_KEY || 'your-ur-airlines-api-key',
    baseUrl: 'https://api.urairlines.com/v1',
    isActive: true,
    priority: 8,
    endpoints: {
      search: '/flights/search',
      status: '/flights/status',
      booking: '/bookings/create',
    },
    requestFormat: 'JSON',
    responseFormat: 'JSON',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  sabre: {
    id: 'sabre-connection',
    supplier: sabreSupplier,
    apiKey: process.env.SABRE_API_KEY || 'your-sabre-api-key',
    baseUrl: 'https://api.sabre.com/v3.3.0',
    isActive: true,
    priority: 3,
    endpoints: {
      search: '/shop/flights',
      status: '/air/flightstatus',
      booking: '/book/flights',
    },
    requestFormat: 'SOAP',
    responseFormat: 'XML',
    errorHandling: {
      retryAttempts: 3,
      retryDelay: 1500,
    },
  },
};
