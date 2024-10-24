import { APIGatewayProxyHandler } from 'aws-lambda';
import { generatePNRFromProvider } from '../services/bookingService';
import { CharterFlight } from '../models/CharterFlight';
import { PricingRule } from '../models/PricingRule';

const calculateDynamicPrice = async (flight: CharterFlight, bookingData: any) => {
  const pricingRules = await PricingRule.query(flight.id);
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
  const recentBookings = await getRecentBookings(flight.id, 24);
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
    const bookingData = JSON.parse(event.body || '{}');
    const tenant = event.headers['x-tenant-id'];

    if (!bookingData || !tenant) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Booking data and Tenant ID are required' }),
      };
    }

    let flight;
    if (event.isCharterFlight) {
      flight = await CharterFlight.get(event.flightId);
    } else {
      // Existing regular flight retrieval logic
    }

    if (!flight) {
      throw new Error('Flight not found');
    }

    let finalPrice;
    if (event.isCharterFlight) {
      finalPrice = await calculateDynamicPrice(flight, bookingData);
    } else {
      finalPrice = flight.basePrice;
    }

    const pnr = await generatePNRFromProvider(bookingData, tenant);

    return {
      statusCode: 200,
      body: JSON.stringify({ pnr, finalPrice }),
    };
  } catch (error) {
    console.error('Error generating PNR:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
