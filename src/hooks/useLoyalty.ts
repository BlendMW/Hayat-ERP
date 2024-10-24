import { useCallback } from 'react';
import { getApiConfig } from '../utils/tenantUtils';

export const useLoyalty = () => {
  const getLoyaltyPoints = useCallback(async (tenant: string, corporateId: string) => {
    try {
      const apiConfig = getApiConfig(tenant, 'loyalty');
      const response = await fetch(`${apiConfig.baseUrl}/loyalty-points/${corporateId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch loyalty points');
      }

      const data = await response.json();
      return data.loyaltyPoints;
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      throw error;
    }
  }, []);

  return { getLoyaltyPoints };
};
