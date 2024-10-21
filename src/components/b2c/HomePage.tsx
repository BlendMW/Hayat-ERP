import React from 'react';
import { useTenant } from '../../hooks/useTenant';
import { tenantConfig } from '../../config/tenantConfig';

const HomePage: React.FC = () => {
  const { tenant } = useTenant();
  const config = tenantConfig[tenant];

  return (
    <div className={`home-page ${config.theme}`}>
      <img src={config.logo} alt={`${tenant} logo`} />
      <h1>Welcome to the {tenant.toUpperCase()} Portal</h1>
      {/* Add more B2C-specific content */}
    </div>
  );
};

export default HomePage;
