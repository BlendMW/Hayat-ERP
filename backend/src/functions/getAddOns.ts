import { APIGatewayProxyHandler } from 'aws-lambda';
import { getAddOnsFromProvider } from '../services/hayatFlightService';

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

    const addOns = await getAddOnsFromProvider(flightId, tenant);

    return {
      statusCode: 200,
      body: JSON.stringify({ addOns }),
    };
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
