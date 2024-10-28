import { APIGatewayProxyHandler } from 'aws-lambda';
import { processPaymentWithProvider } from '../services/hayatPaymentService';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const paymentDetails = JSON.parse(event.body || '{}');
    const tenant = event.headers['x-tenant-id'];

    if (!paymentDetails || !tenant) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment details and Tenant ID are required' }),
      };
    }

    const paymentResult = await processPaymentWithProvider(paymentDetails, tenant);

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentResult }),
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
