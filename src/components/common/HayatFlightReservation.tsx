import React, { useState } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface HayatFlightReservationProps {
  flightId: string;
  onReservationComplete: (bookingId: string) => void;
}

export const HayatFlightReservation: React.FC<HayatFlightReservationProps> = ({ flightId, onReservationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleReservation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('hayatApi', '/reserve-flight', {
        body: { flightId, holdDurationMinutes: 30 },
      });
      onReservationComplete(response.id);
    } catch (error) {
      console.error('Error reserving flight:', error);
      setError(t('flightReservation.error.reservationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hayat-flight-reservation">
      <button onClick={handleReservation} disabled={loading}>
        {loading ? t('flightReservation.reserving') : t('flightReservation.reserve')}
      </button>
      {error && <p className="hayat-error">{error}</p>}
    </div>
  );
};
