import React from 'react';
import { HayatBookingFlow } from '../common/HayatBookingFlow';

const HayatB2CHomePage: React.FC = () => {
  return (
    <div className="hayat-b2c-home">
      <h1>Welcome to Hayat Travel</h1>
      <HayatBookingFlow userType="b2c" />
    </div>
  );
};

export default HayatB2CHomePage;
