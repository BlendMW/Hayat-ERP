import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { LoadingSpinner } from './LoadingSpinner';
import { validatePassengerDetails } from '../../utils/validationUtils';

interface HayatPassengerDetailsStepProps {
  userType: 'b2c' | 'b2b';
  tenant: any;
  bookingData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onError: (error: string) => void;
}

export const HayatPassengerDetailsStep: React.FC<HayatPassengerDetailsStepProps> = ({
  userType, tenant, bookingData, onNext, onPrevious, onError
}) => {
  const intl = useIntl();
  const [passengers, setPassengers] = useState(
    Array(bookingData.passengers || 1).fill({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passport: '',
      nationality: '',
    })
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
    // Clear error when user starts typing
    if (errors[`${index}-${field}`]) {
      setErrors({ ...errors, [`${index}-${field}`]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePassengerDetails(passengers);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      onError(intl.formatMessage({ id: 'passengerDetails.error.validation' }));
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext({ passengers });
    } catch (error) {
      onError(intl.formatMessage({ id: 'passengerDetails.error.submission' }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="hayat-passenger-details-form space-y-4">
      {passengers.map((passenger, index) => (
        <div key={index} className="passenger-details border p-4 rounded">
          <h3>{intl.formatMessage({ id: 'passengerDetails.passenger' }, { number: index + 1 })}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={passenger.firstName}
              onChange={(e) => handleChange(index, 'firstName', e.target.value)}
              placeholder={intl.formatMessage({ id: 'passengerDetails.firstName' })}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors[`${index}-firstName`] && <p className="text-red-500 text-sm">{errors[`${index}-firstName`]}</p>}
            {/* Add similar input fields for lastName, dateOfBirth, passport, and nationality */}
          </div>
        </div>
      ))}
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
          {intl.formatMessage({ id: 'common.next' })}
        </button>
      </div>
    </form>
  );
};
