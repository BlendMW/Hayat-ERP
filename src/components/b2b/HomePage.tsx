import React from 'react';
import { useTenant } from '../../hooks/useTenant';
import { tenantConfig } from '../../config/tenantConfig';

const HomePage: React.FC = () => {
  const { tenant } = useTenant();
  const config = tenantConfig[tenant];

  return (
    <div className={`home-page ${config.theme}`}>
      <img src={config.logo} alt={`${tenant} logo`} />
      <h1>Welcome to the B2B Portal</h1>
      <p>Manage your business travel and corporate bookings here.</p>
      <div className="quick-links">
        <button>Search Flights</button>
        <button>Manage Bookings</button>
        <button>Corporate Reports</button>
      </div>
    </div>
  );
};

export default HomePage;
