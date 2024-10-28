import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
import { HayatConfirmationDialog } from './HayatConfirmationDialog';

interface Booking {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  totalPrice: number;
}

interface ModificationChange {
  type: 'date' | 'passenger' | 'seat' | 'ancillaryService';
  newDate?: string;
  passengerId?: string;
  newDetails?: any;
  newSeat?: string;
  serviceId?: string;
  action?: 'add' | 'remove';
}

export const HayatBookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [modifyingBooking, setModifyingBooking] = useState<Booking | null>(null);
  const [modificationChanges, setModificationChanges] = useState<ModificationChange[]>([]);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/bookings', {});
      setBookings(response);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(t('bookingManagement.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleModifyBooking = async (bookingId: string) => {
    try {
      const response = await API.put('hayatApi', `/bookings/${bookingId}/modify`, {
        body: { changes: modificationChanges },
      });
      fetchBookings();
      setModifyingBooking(null);
      setModificationChanges([]);
    } catch (error) {
      console.error('Error modifying booking:', error);
      setError(t('bookingManagement.error.modificationFailed'));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setConfirmationDialog({
      isOpen: true,
      title: t('bookingManagement.cancelBookingTitle'),
      message: t('bookingManagement.cancelBookingMessage'),
      onConfirm: async () => {
        try {
          await API.post('hayatApi', `/bookings/${bookingId}/cancel`, {});
          fetchBookings();
          setConfirmationDialog({ ...confirmationDialog, isOpen: false });
        } catch (error) {
          console.error('Error cancelling booking:', error);
          setError(t('bookingManagement.error.cancellationFailed'));
        }
      },
    });
  };

  const renderModificationForm = () => {
    if (!modifyingBooking) return null;

    return (
      <div className="hayat-modification-form">
        <h3>{t('bookingManagement.modifyBooking')}</h3>
        {/* Render form inputs for date, passenger details, seat, and ancillary services */}
        <button onClick={() => handleModifyBooking(modifyingBooking.id)}>
          {t('bookingManagement.confirmModification')}
        </button>
        <button onClick={() => setModifyingBooking(null)}>
          {t('bookingManagement.cancelModification')}
        </button>
      </div>
    );
  };

  return (
    <div className="hayat-booking-management">
      <h2>{t('bookingManagement.title')}</h2>
      {loading && <p>{t('bookingManagement.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <ul className="hayat-booking-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="hayat-booking-item">
              <h3>{booking.flightNumber}</h3>
              <p>{t('bookingManagement.departure')}: {new Date(booking.departureTime).toLocaleString()}</p>
              <p>{t('bookingManagement.arrival')}: {new Date(booking.arrivalTime).toLocaleString()}</p>
              <p>{t('bookingManagement.status')}: {booking.status}</p>
              <p>{t('bookingManagement.price')}: {booking.totalPrice}</p>
              <button onClick={() => handleModifyBooking(booking.id)}>
                {t('bookingManagement.modify')}
              </button>
              <button onClick={() => handleCancelBooking(booking.id)}>
                {t('bookingManagement.cancel')}
              </button>
            </li>
          ))}
        </ul>
      )}
      {modifyingBooking && renderModificationForm()}
      <HayatConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
      />
    </div>
  );
};
