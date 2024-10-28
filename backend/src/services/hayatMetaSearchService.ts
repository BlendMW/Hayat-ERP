import axios from 'axios';
import { ExternalProvider } from '../models/HayatExternalProvider';
import { MetaSearchResult } from '../models/HayatMetaSearchResult';
import { HayatError } from '../utils/errorHandling';
import { cacheSet, cacheGet } from './hayatCacheService';

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
}

const CACHE_EXPIRATION = 3600; // 1 hour

export const performMetaSearch = async (searchParams: SearchParams): Promise<MetaSearchResult[]> => {
  validateSearchParams(searchParams);

  const cacheKey = `metasearch:${JSON.stringify(searchParams)}`;
  const cachedResults = await cacheGet(cacheKey);

  if (cachedResults) {
    return cachedResults;
  }

  const activeProviders = await ExternalProvider.findAll({ where: { isActive: true } });
  const searchPromises = activeProviders.map(provider => searchProvider(provider, searchParams));
  const results = await Promise.allSettled(searchPromises);

  const successfulResults = results
    .filter((result): result is PromiseFulfilledResult<MetaSearchResult[]> => result.status === 'fulfilled')
    .flatMap(result => result.value);

  await cacheSet(cacheKey, successfulResults, CACHE_EXPIRATION);

  return successfulResults;
};

const searchProvider = async (provider: ExternalProvider, searchParams: SearchParams): Promise<MetaSearchResult[]> => {
  try {
    switch (provider.providerName) {
      case 'Skyscanner':
        return await searchSkyscanner(provider, searchParams);
      case 'Kayak':
        return await searchKayak(provider, searchParams);
      case 'Expedia':
        return await searchExpedia(provider, searchParams);
      default:
        console.warn(`Unsupported provider: ${provider.providerName}`);
        return [];
    }
  } catch (error) {
    console.error(`Error searching ${provider.providerName}:`, error);
    return [];
  }
};

const searchSkyscanner = async (provider: ExternalProvider, searchParams: SearchParams): Promise<MetaSearchResult[]> => {
  try {
    const response = await axios.get('https://skyscanner-api.example.com/search', {
      params: {
        apiKey: provider.providerApiKey,
        ...searchParams,
      },
    });

    return response.data.results.map((result: any) => new MetaSearchResult({
      searchId: `${searchParams.origin}-${searchParams.destination}-${searchParams.departureDate}`,
      provider: 'Skyscanner',
      flightNumber: result.flightNumber,
      departureAirport: result.departureAirport,
      arrivalAirport: result.arrivalAirport,
      departureTime: result.departureTime,
      arrivalTime: result.arrivalTime,
      price: result.price,
      deepLink: result.deepLink,
      affiliateCommission: result.affiliateCommission,
    }));
  } catch (error) {
    console.error('Error searching Skyscanner:', error);
    return [];
  }
};

const searchKayak = async (provider: ExternalProvider, searchParams: SearchParams): Promise<MetaSearchResult[]> => {
  try {
    const response = await axios.get('https://kayak-api.example.com/search', {
      params: {
        apiKey: provider.providerApiKey,
        ...searchParams,
      },
    });

    return response.data.flights.map((flight: any) => new MetaSearchResult({
      searchId: `${searchParams.origin}-${searchParams.destination}-${searchParams.departureDate}`,
      provider: 'Kayak',
      flightNumber: flight.flightNumber,
      departureAirport: flight.from,
      arrivalAirport: flight.to,
      departureTime: flight.departureDateTime,
      arrivalTime: flight.arrivalDateTime,
      price: flight.totalPrice,
      deepLink: flight.bookingLink,
      affiliateCommission: flight.commission,
    }));
  } catch (error) {
    console.error('Error searching Kayak:', error);
    return [];
  }
};

const searchExpedia = async (provider: ExternalProvider, searchParams: SearchParams): Promise<MetaSearchResult[]> => {
  try {
    const response = await axios.get('https://expedia-api.example.com/flights', {
      params: {
        apiKey: provider.providerApiKey,
        from: searchParams.origin,
        to: searchParams.destination,
        date: searchParams.departureDate,
        passengers: searchParams.adults,
      },
    });

    return response.data.offers.map((offer: any) => new MetaSearchResult({
      searchId: `${searchParams.origin}-${searchParams.destination}-${searchParams.departureDate}`,
      provider: 'Expedia',
      flightNumber: offer.flightDetails.flightNumber,
      departureAirport: offer.flightDetails.origin,
      arrivalAirport: offer.flightDetails.destination,
      departureTime: offer.flightDetails.departureTime,
      arrivalTime: offer.flightDetails.arrivalTime,
      price: offer.pricing.totalPrice,
      deepLink: offer.bookingUrl,
      affiliateCommission: offer.affiliateInfo.commission,
    }));
  } catch (error) {
    console.error('Error searching Expedia:', error);
    return [];
  }
};

const validateSearchParams = (params: SearchParams): void => {
  if (!params.origin || !params.destination || !params.departureDate || !params.adults) {
    throw new HayatError('Missing required search parameters', 400);
  }

  if (params.origin === params.destination) {
    throw new HayatError('Origin and destination cannot be the same', 400);
  }

  const departureDate = new Date(params.departureDate);
  if (isNaN(departureDate.getTime()) || departureDate < new Date()) {
    throw new HayatError('Invalid departure date', 400);
  }

  if (params.returnDate) {
    const returnDate = new Date(params.returnDate);
    if (isNaN(returnDate.getTime()) || returnDate < departureDate) {
      throw new HayatError('Invalid return date', 400);
    }
  }

  if (params.adults < 1 || params.adults > 9) {
    throw new HayatError('Invalid number of adults', 400);
  }
};
