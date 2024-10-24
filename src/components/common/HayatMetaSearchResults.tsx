import React from 'react';
import { useTranslation } from 'react-i18next';

interface Flight {
  id: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  provider: string;
  deepLink?: string;
}

interface HayatMetaSearchResultsProps {
  internalResults: Flight[];
  externalResults: Flight[];
}

export const HayatMetaSearchResults: React.FC<HayatMetaSearchResultsProps> = ({ internalResults, externalResults }) => {
  const { t } = useTranslation();

  const renderFlight = (flight: Flight) => (
    <div key={flight.id} className="hayat-flight-item">
      <h3>{flight.flightNumber}</h3>
      <p>{t('search.from')} {flight.departureAirport} {t('search.to')} {flight.arrivalAirport}</p>
      <p>{t('search.departure')}: {new Date(flight.departureTime).toLocaleString()}</p>
      <p>{t('search.arrival')}: {new Date(flight.arrivalTime).toLocaleString()}</p>
      <p>{t('search.price')}: {flight.price}</p>
      <p>{t('search.provider')}: {flight.provider}</p>
      {flight.deepLink && (
        <a href={flight.deepLink} target="_blank" rel="noopener noreferrer">
          {t('search.bookExternally')}
        </a>
      )}
    </div>
  );

  return (
    <div className="hayat-meta-search-results">
      <h2>{t('search.internalResults')}</h2>
      {internalResults.map(renderFlight)}
      <h2>{t('search.externalResults')}</h2>
      {externalResults.map(renderFlight)}
    </div>
  );
};
