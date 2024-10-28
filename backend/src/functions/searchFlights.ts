import { APIGatewayProxyHandler } from 'aws-lambda';
import { searchFlightsFromProvider } from '../services/hayatFlightService';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const searchCriteria = JSON.parse(event.body || '{}');
    const tenant = event.headers['x-tenant-id'];

    if (!tenant) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Tenant ID is required' }),
      };
    }

    const flights = await searchFlightsFromProvider(searchCriteria, tenant);

    return {
      statusCode: 200,
      body: JSON.stringify({ flights }),
    };
  } catch (error) {
    console.error('Error searching flights:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
