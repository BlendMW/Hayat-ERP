import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface Reservation {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  holdExpiresAt: string;
}

export const HayatReservationManager: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/reservations', {});
      setReservations(response);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(t('reservations.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      await API.post('hayatApi', `/reservations/${reservationId}/confirm`, {});
      fetchReservations();
    } catch (error) {
      console.error('Error confirming reservation:', error);
      setError(t('reservations.error.confirmFailed'));
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await API.post('hayatApi', `/reservations/${reservationId}/cancel`, {});
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setError(t('reservations.error.cancelFailed'));
    }
  };

  return (
    <div className="hayat-reservation-manager">
      <h2>{t('reservations.title')}</h2>
      {loading && <p>{t('reservations.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <h3>{reservation.flightNumber}</h3>
              <p>{t('reservations.departure')}: {new Date(reservation.departureTime).toLocaleString()}</p>
              <p>{t('reservations.arrival')}: {new Date(reservation.arrivalTime).toLocaleString()}</p>
              <p>{t('reservations.holdExpires')}: {new Date(reservation.holdExpiresAt).toLocaleString()}</p>
              <button onClick={() => handleConfirmReservation(reservation.id)}>
                {t('reservations.confirm')}
              </button>
              <button onClick={() => handleCancelReservation(reservation.id)}>
                {t('reservations.cancel')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
