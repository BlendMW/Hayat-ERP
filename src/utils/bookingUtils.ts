import { getApiConfig } from './tenantUtils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const generatePNR = async (bookingData: any, tenant: string): Promise<string> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const apiConfig = getApiConfig(tenant, 'booking');
      const response = await fetch(`${apiConfig.baseUrl}/generate-pnr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PNR');
      }

      const data = await response.json();
      return data.pnr;
    } catch (error) {
      console.error(`Error generating PNR (attempt ${retries + 1}):`, error);
      retries++;

      if (retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw new Error('Failed to generate PNR after multiple attempts');
      }
    }
  }

  throw new Error('Unexpected error in PNR generation');
};
