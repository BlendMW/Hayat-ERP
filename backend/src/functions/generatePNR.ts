import { APIGatewayProxyHandler } from 'aws-lambda';
import { generatePNRFromProvider } from '../services/hayatBookingService';
import { HayatCharterFlight } from '../models/HayatCharterFlight';
import { HayatPricingRule } from '../models/HayatPricingRule';
import { handleError, HayatError } from '../utils/errorHandling';

interface HayatBookingData {
  flightId: string;
  isCharterFlight: boolean;
}

async function getHayatRecentBookings(flightId: string, hours: number): Promise<{ length: number }> {
  // Mock implementation, replace with real query logic to retrieve recent bookings
  return { length: 5 }; // Mock 5 bookings
}

const calculateHayatDynamicPrice = async (flight: HayatCharterFlight, bookingData: HayatBookingData) => {
  const pricingRules = await HayatPricingRule.query(flight.id);
  let finalPrice = flight.basePrice;

  const availableSeats = flight.availableSeats;
  for (const rule of pricingRules) {
    if (availableSeats >= rule.minAvailableSeats && availableSeats <= rule.maxAvailableSeats) {
      finalPrice *= rule.priceMultiplier;
      break;
    }
  }

  const recentBookings = await getHayatRecentBookings(flight.id, 24);
  const demandMultiplier = 1 + (recentBookings.length * 0.01);
  finalPrice *= demandMultiplier;

  const now = new Date();
  const departureTime = new Date(flight.departureTime);
  const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilDeparture < 48) {
    finalPrice *= 1.1;
  }

  return finalPrice;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const bookingData: HayatBookingData = JSON.parse(event.body || '{}');
    const tenant = event.headers['x-tenant-id'];

    if (!bookingData || !tenant) {
      throw new HayatError('Booking data and Tenant ID are required', 400);
    }

    let flight;
    if (bookingData.isCharterFlight) {
      flight = await HayatCharterFlight.get(bookingData.flightId);
    }

    if (!flight) {
      throw new HayatError('Flight not found', 404);
    }

    let finalPrice;
    if (bookingData.isCharterFlight) {
      finalPrice = await calculateHayatDynamicPrice(flight, bookingData);
    } else {
      finalPrice = flight.basePrice;
    }

    const pnr = await generatePNRFromProvider(bookingData, tenant);

    return {
      statusCode: 200,
      body: JSON.stringify({ pnr, finalPrice }),
    };
  } catch (error) {
    return handleError(error);
  }
};
