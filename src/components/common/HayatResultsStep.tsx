import React, { useEffect, useState } from 'react';
import { searchFlights } from '../../utils/flightUtils';
import { LoadingSpinner } from './LoadingSpinner';

interface HayatResultsStepProps {
  userType: 'b2c' | 'b2b';
  tenant: any;
  bookingData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onError: (error: string) => void;
}

export const HayatResultsStep: React.FC<HayatResultsStepProps> = ({
  userType, tenant, bookingData, onNext, onPrevious, onError
}) => {
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const results = await searchFlights(bookingData, tenant);
        setFlightResults(results);
      } catch (error) {
        onError('Failed to fetch flight results');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [bookingData, tenant, onError]);

  const handleSelectFlight = (flight: any) => {
    onNext({ selectedFlight: flight });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="hayat-flight-results">
      <h2>Flight Results</h2>
      {flightResults.map((flight: any, index) => (
        <div key={index} className="hayat-flight-option">
          <h3>{flight.airline}</h3>
          <p>Departure: {flight.departureTime}</p>
          <p>Arrival: {flight.arrivalTime}</p>
          <p>Price: {flight.price}</p>
          <button onClick={() => handleSelectFlight(flight)}>Select</button>
        </div>
      ))}
    </div>
  );
};
