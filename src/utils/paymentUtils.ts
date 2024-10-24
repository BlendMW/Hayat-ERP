import { getApiConfig } from './tenantUtils';

export const processPayment = async (paymentDetails: any, bookingData: any, tenant: string) => {
  try {
    const apiConfig = getApiConfig(tenant, 'payment');
    const response = await fetch(`${apiConfig.baseUrl}/process-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`,
      },
      body: JSON.stringify({ paymentDetails, bookingData }),
    });

    if (!response.ok) {
      throw new Error('Payment processing failed');
    }

    const data = await response.json();
    return data.paymentResult;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};
