import { getApiConfig } from './tenantUtils';

export const searchFlights = async (searchCriteria: any, tenant: string) => {
  try {
    const apiConfig = getApiConfig(tenant, 'flights');
    const response = await fetch(`${apiConfig.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`,
      },
      body: JSON.stringify(searchCriteria),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch flight results');
    }

    const data = await response.json();
    return data.flights;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const fetchSeatMap = async (flightId: string, tenant: string) => {
  try {
    const apiConfig = getApiConfig(tenant, 'flights');
    const response = await fetch(`${apiConfig.baseUrl}/seat-map/${flightId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seat map');
    }

    const data = await response.json();
    return data.seatMap;
  } catch (error) {
    console.error('Error fetching seat map:', error);
    throw error;
  }
};

export const fetchAddOns = async (flightId: string, tenant: string) => {
  try {
    const apiConfig = getApiConfig(tenant, 'flights');
    const response = await fetch(`${apiConfig.baseUrl}/add-ons/${flightId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch add-ons');
    }

    const data = await response.json();
    return data.addOns;
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    throw error;
  }
};
