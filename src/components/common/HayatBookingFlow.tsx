import React, { useState } from 'react';
import { useTenant } from '../../hooks/useTenant';
import { HayatSearchStep } from './HayatSearchStep';
import { HayatResultsStep } from './HayatResultsStep';
import { HayatPassengerDetailsStep } from './HayatPassengerDetailsStep';
import { HayatSeatSelectionStep } from './HayatSeatSelectionStep';
import { HayatAddOnsStep } from './HayatAddOnsStep';
import { HayatPaymentStep } from './HayatPaymentStep';
import { HayatConfirmationStep } from './HayatConfirmationStep';
import { HayatCorporateApprovalStep } from './HayatCorporateApprovalStep';
import { BookingProvider } from '../../contexts/BookingContext';
import { useBooking } from '../../contexts/BookingContext';

interface HayatBookingFlowProps {
  userType: 'b2c' | 'b2b';
}

export const HayatBookingFlow: React.FC<HayatBookingFlowProps> = ({ userType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { tenant } = useTenant();
  const { bookingData, updateBookingData } = useBooking();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const steps = [
    { component: HayatSearchStep, label: 'Search' },
    { component: HayatResultsStep, label: 'Select Flight' },
    { component: HayatPassengerDetailsStep, label: 'Passenger Details' },
    { component: HayatSeatSelectionStep, label: 'Seat Selection' },
    { component: HayatAddOnsStep, label: 'Add-ons' },
    ...(userType === 'b2b' ? [{ component: HayatCorporateApprovalStep, label: 'Corporate Approval' }] : []),
    { component: HayatPaymentStep, label: 'Payment' },
    { component: HayatConfirmationStep, label: 'Confirmation' },
  ];

  const handleNextStep = (data: any) => {
    updateBookingData(data);
    setCurrentStep(currentStep + 1);
    setError(null);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <BookingProvider>
      <div className="hayat-booking-flow">
        <div className="hayat-booking-progress">
          {steps.map((step, index) => (
            <span key={index} className={index === currentStep ? 'active' : ''}>
              {step.label}
            </span>
          ))}
        </div>
        {error && (
          <div className="hayat-error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <CurrentStepComponent
          userType={userType}
          tenant={tenant}
          bookingData={bookingData}
          flightId={selectedFlight?.id || ''}
          onSeatSelected={(seat: string, price: number) => {
            // Implement seat selection logic
          }}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          onError={handleError}
        />
      </div>
    </BookingProvider>
  );
};
