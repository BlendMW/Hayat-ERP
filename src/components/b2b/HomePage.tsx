import React from 'react';
import { HayatBookingFlow } from '../common/HayatBookingFlow';

const HayatB2BHomePage: React.FC = () => {
  return (
    <div className="hayat-b2b-home">
      <h1>Hayat Travel - Business Portal</h1>
      <HayatBookingFlow userType="b2b" />
    </div>
  );
};

export default HayatB2BHomePage;
