import { APIGatewayProxyHandler } from 'aws-lambda';
import { generatePNRFromProvider } from '../services/hayatBookingService';
import { HayatCharterFlight } from '../models/HayatCharterFlight';
import { HayatPricingRule } from '../models/HayatPricingRule';
import { getHayatRecentBookings } from '../services/hayatBookingService';
import { HayatError, handleHayatError } from '../utils/hayatErrorHandling';

interface HayatBookingData {
  flightId: string;
  isCharterFlight: boolean;
  // Add other necessary fields
}

const calculateHayatDynamicPrice = async (flight: HayatCharterFlight, bookingData: HayatBookingData) => {
  const pricingRules = await HayatPricingRule.query(flight.id);
  let finalPrice = flight.basePrice;

  // Factor in available seats
  const availableSeats = flight.availableSeats;
  for (const rule of pricingRules) {
    if (availableSeats >= rule.minAvailableSeats && availableSeats <= rule.maxAvailableSeats) {
      finalPrice *= rule.priceMultiplier;
      break;
    }
  }

  // Factor in demand (number of bookings in the last 24 hours)
  const recentBookings = await getHayatRecentBookings(flight.id, 24);
  const demandMultiplier = 1 + (recentBookings.length * 0.01); // Increase price by 1% for each recent booking
  finalPrice *= demandMultiplier;

  // Factor in booking velocity (time until departure)
  const now = new Date();
  const departureTime = new Date(flight.departureTime);
  const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilDeparture < 48) {
    finalPrice *= 1.1; // Increase price by 10% if less than 48 hours until departure
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
    } else {
      // Existing regular flight retrieval logic
      // Implement this part based on your regular flight model
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
    return handleHayatError(error);
  }
};
