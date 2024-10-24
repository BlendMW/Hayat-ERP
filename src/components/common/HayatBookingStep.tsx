import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
import { HayatError } from '../../utils/errorHandling';
import { HayatSeatSelectionStep } from './HayatSeatSelectionStep';
import { HayatAncillaryServicesStep } from './HayatAncillaryServicesStep';

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

interface HayatBookingStepProps {
  selectedFlight: Flight;
}

export const HayatBookingStep: React.FC<HayatBookingStepProps> = ({ selectedFlight }) => {
  const [price, setPrice] = useState(selectedFlight.basePrice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [seatPrice, setSeatPrice] = useState(0);
  const [selectedServices, setSelectedServices] = useState<AncillaryService[]>([]);

  useEffect(() => {
    if (selectedFlight.isCharterFlight) {
      calculateDynamicPrice();
    }
  }, [selectedFlight]);

  const calculateDynamicPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', `/charter-flights/${selectedFlight.id}/price`, {});
      setPrice(response.price);
    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      setError(t('booking.error.priceFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelected = (seat: string, price: number) => {
    setSelectedSeat(seat);
    setSeatPrice(price);
  };

  const handleServicesSelected = (services: AncillaryService[]) => {
    setSelectedServices(services);
  };

  const handleBooking = async (bookingData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('hayatApi', '/bookings', {
        body: {
          ...bookingData,
          flightId: selectedFlight.id,
          isCharterFlight: selectedFlight.isCharterFlight,
          price: price + seatPrice + selectedServices.reduce((total, service) => total + service.price, 0),
          selectedSeat,
          selectedServices: selectedServices.map(service => service.id),
        },
      });
      
      // Handle successful booking (e.g., show confirmation, navigate to payment)
      navigateToPayment(response.bookingId);
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response && error.response.data && error.response.data.error === 'Insufficient credit') {
        setError(t('booking.error.insufficientCredit'));
      } else {
        setError(t('booking.error.bookingFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReserveFlight = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('hayatApi', '/reserve-flight', {
        body: {
          flightId: selectedFlight.id,
          holdDurationMinutes: 30, // You can make this configurable
        },
      });
      // Navigate to reservation management or payment page
      navigateToReservationManagement(response.id);
    } catch (error) {
      console.error('Error reserving flight:', error);
      setError(t('booking.error.reservationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hayat-booking-step">
      <h2>{t('booking.title')}</h2>
      {loading && <p>{t('booking.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <>
          <p>{t('booking.flightDetails', { flightNumber: selectedFlight.flightNumber })}</p>
          <p>{t('booking.price', { price })}</p>
          <HayatSeatSelectionStep flightId={selectedFlight.id} onSeatSelected={handleSeatSelected} />
          <HayatAncillaryServicesStep flightId={selectedFlight.id} onServicesSelected={handleServicesSelected} />
          {/* Add booking form here */}
          <button onClick={() => handleBooking({ /* Add form data here */ })}>
            {t('booking.confirmButton')}
          </button>
          <button onClick={handleReserveFlight}>
            {t('booking.reserveFlight')}
          </button>
        </>
      )}
    </div>
  );
};
