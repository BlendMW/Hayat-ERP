import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { processPayment } from '../../utils/paymentUtils';
import { useBooking } from '../../contexts/BookingContext';

interface HayatPaymentStepProps {
  userType: 'b2c' | 'b2b';
  tenant: any;
  bookingData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onError: (error: string) => void;
}

export const HayatPaymentStep: React.FC<HayatPaymentStepProps> = ({
  userType, tenant, bookingData, onNext, onPrevious, onError
}) => {
  const intl = useIntl();
  const { calculateTotalPrice } = useBooking();
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === 'b2b' && bookingData.isPendingPayment) {
        // For corporate bookings with pending payment, skip actual payment processing
        onNext({ paymentStatus: 'pending' });
      } else {
        const totalPrice = calculateTotalPrice();
        const paymentResult = await processPayment(paymentDetails, { ...bookingData, totalPrice }, tenant);
        onNext({ paymentResult });
      }
    } catch (error) {
      onError(intl.formatMessage({ id: 'payment.error.processing' }));
    }
  };

  if (userType === 'b2b' && bookingData.isPendingPayment) {
    return (
      <div className="hayat-payment-pending">
        <h2>{intl.formatMessage({ id: 'payment.pending.title' })}</h2>
        <p>{intl.formatMessage({ id: 'payment.pending.message' })}</p>
        <button
          onClick={() => onNext({ paymentStatus: 'pending' })}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {intl.formatMessage({ id: 'common.continue' })}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hayat-payment-form space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'payment.cardNumber' })}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="text"
          name="expiryDate"
          value={paymentDetails.expiryDate}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'payment.expiryDate' })}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="text"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'payment.cvv' })}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="text"
          name="name"
          value={paymentDetails.name}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'payment.cardholderName' })}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {intl.formatMessage({ id: 'common.previous' })}
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {intl.formatMessage({ id: 'payment.payNow' })}
        </button>
      </div>
    </form>
  );
};
