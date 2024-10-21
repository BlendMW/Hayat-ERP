import React from 'react';
import { useTenant } from '../../hooks/useTenant';
import { tenantConfig } from '../../config/tenantConfig';

const HomePage: React.FC = () => {
  const { tenant } = useTenant();
  const config = tenantConfig[tenant];

  return (
    <div className={`home-page ${config.theme}`}>
      <img src={config.logo} alt={`${tenant} logo`} />
      <h1>Welcome to the Employee Travel Portal</h1>
      <p>Book and manage your business travel with ease.</p>
      <div className="employee-dashboard">
        <div className="travel-policy">
          <h2>Travel Policy</h2>
          <p>View your company's travel policy and guidelines.</p>
          <button>View Policy</button>
        </div>
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <button>Book a Flight</button>
          <button>View My Trips</button>
          <button>Submit Expense Report</button>
        </div>
        <div className="travel-alerts">
          <h2>Travel Alerts</h2>
          <ul>
            <li>COVID-19 travel restrictions in effect for certain destinations.</li>
            <li>New direct flight available to San Francisco.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
