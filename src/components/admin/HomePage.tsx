import React from 'react';
import { useTenant } from '../../hooks/useTenant';
import { tenantConfig } from '../../config/tenantConfig';

const HomePage: React.FC = () => {
  const { tenant } = useTenant();
  const config = tenantConfig[tenant];

  return (
    <div className={`home-page ${config.theme}`}>
      <img src={config.logo} alt={`${tenant} logo`} />
      <h1>Admin Dashboard</h1>
      <p>Manage all aspects of the flight booking system.</p>
      <div className="admin-panels">
        <div className="panel">
          <h2>User Management</h2>
          <button>View Users</button>
          <button>Add User</button>
        </div>
        <div className="panel">
          <h2>Booking Management</h2>
          <button>View Bookings</button>
          <button>Manage Cancellations</button>
        </div>
        <div className="panel">
          <h2>System Settings</h2>
          <button>API Configurations</button>
          <button>Pricing Rules</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
