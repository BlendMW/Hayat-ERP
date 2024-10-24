import React from 'react';
import { useTenant } from '../../hooks/useTenant';

const BookingPage: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <div className={`${tenant}-booking-page`}>
      <h2>B2B Flight Booking</h2>
      {/* Add B2B-specific booking form and confirmation process */}
    </div>
  );
};

export default BookingPage;
