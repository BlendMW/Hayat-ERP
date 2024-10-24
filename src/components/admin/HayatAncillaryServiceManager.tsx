import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface AncillaryService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  flightId?: string;
}

export const HayatAncillaryServiceManager: React.FC = () => {
  const [services, setServices] = useState<AncillaryService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAncillaryServices();
  }, []);

  const fetchAncillaryServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/ancillary-services', {});
      setServices(response);
    } catch (error) {
      console.error('Error fetching ancillary services:', error);
      setError(t('admin.ancillaryServices.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (service: Omit<AncillaryService, 'id'>) => {
    try {
      await API.post('hayatApi', '/ancillary-services', { body: service });
      fetchAncillaryServices();
    } catch (error) {
      console.error('Error creating ancillary service:', error);
      setError(t('admin.ancillaryServices.error.createFailed'));
    }
  };

  const handleUpdateService = async (service: AncillaryService) => {
    try {
      await API.put('hayatApi', `/ancillary-services/${service.id}`, { body: service });
      fetchAncillaryServices();
    } catch (error) {
      console.error('Error updating ancillary service:', error);
      setError(t('admin.ancillaryServices.error.updateFailed'));
    }
  };

  // Render service editor and list of services
  // ...

  return (
    <div className="hayat-ancillary-service-manager">
      <h2>{t('admin.ancillaryServices.title')}</h2>
      {/* Render service list and editor */}
    </div>
  );
};
