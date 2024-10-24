import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
import { HayatError } from '../../utils/errorHandling';

interface Flight {
  id: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  isCharterFlight: boolean;
}

export const HayatSearchStep: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const regularFlights = await API.get('hayatApi', '/flights', {});
      const charterFlights = await API.get('hayatApi', '/charter-flights', {});
      setFlights([...regularFlights, ...charterFlights]);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(t('search.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const renderFlightList = (flights: Flight[]) => {
    return flights.map((flight) => (
      <div key={flight.id} className="hayat-flight-item">
        <h3>{flight.flightNumber} {flight.isCharterFlight && t('search.charterFlight')}</h3>
        <p>{t('search.from')} {flight.departureAirport} {t('search.to')} {flight.arrivalAirport}</p>
        <p>{t('search.departure')}: {new Date(flight.departureTime).toLocaleString()}</p>
        <p>{t('search.arrival')}: {new Date(flight.arrivalTime).toLocaleString()}</p>
        <p>{t('search.price')}: {flight.basePrice}</p>
        {/* Add a button or link to select this flight */}
      </div>
    ));
  };

  return (
    <div className="hayat-search-step">
      <h2>{t('search.title')}</h2>
      {/* Add search form here */}
      {loading && <p>{t('search.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <div className="hayat-flight-results">
          {flights.length > 0 ? renderFlightList(flights) : <p>{t('search.noFlights')}</p>}
        </div>
      )}
    </div>
  );
};
