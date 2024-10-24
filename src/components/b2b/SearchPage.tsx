import React from 'react';
import { useTenant } from '../../hooks/useTenant';
import '../../styles/b2b.css';

const SearchPage: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <div className={`${tenant}-search-page`}>
      <h2>B2B Flight Search</h2>
      {/* Add B2B-specific search form and results display */}
    </div>
  );
};

export default SearchPage;
