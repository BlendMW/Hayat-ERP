import React, { useEffect, useState } from 'react';
import { generatePNR } from '../../utils/bookingUtils';
import { useIntl } from 'react-intl';

interface HayatConfirmationStepProps {
  userType: 'b2c' | 'b2b';
  tenant: any;
  bookingData: any;
}

export const HayatConfirmationStep: React.FC<HayatConfirmationStepProps> = ({ userType, tenant, bookingData }) => {
  const [pnr, setPNR] = useState('');
  const [error, setError] = useState<string | null>(null);
  const intl = useIntl();

  useEffect(() => {
    const createPNR = async () => {
      try {
        const generatedPNR = await generatePNR(bookingData, tenant);
        setPNR(generatedPNR);
      } catch (error) {
        console.error('Error generating PNR:', error);
        setError(intl.formatMessage({ id: 'confirmation.error.pnrGeneration' }));
      }
    };

    createPNR();
  }, [bookingData, tenant, intl]);

  if (error) {
    return (
      <div className="hayat-confirmation-error">
        <h2>{intl.formatMessage({ id: 'confirmation.error.title' })}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="hayat-confirmation space-y-4">
      <h2 className="text-2xl font-semibold">{intl.formatMessage({ id: 'confirmation.title' })}</h2>
      <p className="text-lg">{intl.formatMessage({ id: 'confirmation.thankYou' })}</p>
      <p className="text-lg">
        {intl.formatMessage({ id: 'confirmation.pnr' })}: <strong>{pnr}</strong>
      </p>
      <div className="hayat-booking-summary space-y-2">
        <h3 className="text-xl font-semibold">Booking Summary</h3>
        <p>Flight: {bookingData.selectedFlight.airline} - {bookingData.selectedFlight.flightNumber}</p>
        <p>Departure: {bookingData.selectedFlight.departureTime} from {bookingData.selectedFlight.origin}</p>
        <p>Arrival: {bookingData.selectedFlight.arrivalTime} at {bookingData.selectedFlight.destination}</p>
        <h4 className="text-lg font-semibold">Passengers:</h4>
        <ul>
          {bookingData.passengers.map((passenger: any, index: number) => (
            <li key={index}>{passenger.firstName} {passenger.lastName}</li>
          ))}
        </ul>
        <h4 className="text-lg font-semibold">Selected Seats:</h4>
        <p>{bookingData.selectedSeats.join(', ')}</p>
        {bookingData.selectedAddOns.length > 0 && (
          <>
            <h4 className="text-lg font-semibold">Add-ons:</h4>
            <ul>
              {bookingData.selectedAddOns.map((addOn: string, index: number) => (
                <li key={index}>{addOn}</li>
              ))}
            </ul>
          </>
        )}
        <h4 className="text-lg font-semibold">Total Price:</h4>
        <p>${bookingData.totalPrice}</p>
        {userType === 'b2b' && (
          <>
            <h4 className="text-lg font-semibold">Payment Status:</h4>
            <p>{bookingData.isPendingPayment ? 'Pending (Invoice)' : 'Paid'}</p>
            <h4 className="text-lg font-semibold">Loyalty Points Earned:</h4>
            <p>{bookingData.loyaltyPoints}</p>
          </>
        )}
      </div>
    </div>
  );
};
