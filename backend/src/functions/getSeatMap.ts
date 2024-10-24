import { APIGatewayProxyHandler } from 'aws-lambda';
import { getSeatMapFromProvider } from '../services/flightService';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const flightId = event.pathParameters?.flightId;
    const tenant = event.headers['x-tenant-id'];

    if (!flightId || !tenant) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Flight ID and Tenant ID are required' }),
      };
    }

    const seatMap = await getSeatMapFromProvider(flightId, tenant);

    return {
      statusCode: 200,
      body: JSON.stringify({ seatMap }),
    };
  } catch (error) {
    console.error('Error fetching seat map:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
