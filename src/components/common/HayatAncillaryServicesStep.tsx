import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface AncillaryService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
}

interface HayatAncillaryServicesStepProps {
  flightId: string;
  onServicesSelected: (services: AncillaryService[]) => void;
}

export const HayatAncillaryServicesStep: React.FC<HayatAncillaryServicesStepProps> = ({ flightId, onServicesSelected }) => {
  const [services, setServices] = useState<AncillaryService[]>([]);
  const [selectedServices, setSelectedServices] = useState<AncillaryService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAncillaryServices();
  }, [flightId]);

  const fetchAncillaryServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/ancillary-services', {
        queryStringParameters: { flightId },
      });
      setServices(response);
    } catch (error) {
      console.error('Error fetching ancillary services:', error);
      setError(t('ancillaryServices.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service: AncillaryService) => {
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter((s) => s.id !== service.id)
      : [...selectedServices, service];
    setSelectedServices(updatedServices);
    onServicesSelected(updatedServices);
  };

  return (
    <div className="hayat-ancillary-services-step">
      <h2>{t('ancillaryServices.title')}</h2>
      {loading && <p>{t('ancillaryServices.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <ul className="hayat-service-list">
          {services.map((service) => (
            <li key={service.id} className="hayat-service-item">
              <label>
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                {service.name} - {t('ancillaryServices.price', { price: service.price })}
              </label>
              {service.description && <p>{service.description}</p>}
            </li>
          ))}
        </ul>
      )}
      {selectedServices.length > 0 && (
        <p>
          {t('ancillaryServices.totalSelected', {
            count: selectedServices.length,
            price: selectedServices.reduce((total, service) => total + service.price, 0),
          })}
        </p>
      )}
    </div>
  );
};
