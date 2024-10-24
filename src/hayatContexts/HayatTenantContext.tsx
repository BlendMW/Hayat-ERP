import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type HayatTenant = 'hayat_b2c' | 'hayat_b2b' | 'hayat_admin' | 'hayat_b2e';

interface HayatTenantContextType {
  hayatTenant: HayatTenant;
  setHayatTenant: (tenant: HayatTenant) => void;
}

export const HayatTenantContext = createContext<HayatTenantContextType | undefined>(undefined);

export const HayatTenantProvider: React.FC = ({ children }) => {
  const [hayatTenant, setHayatTenant] = useState<HayatTenant>('hayat_b2c');
  const location = useLocation();

  useEffect(() => {
    const determineHayatTenant = (): HayatTenant => {
      const path = location.pathname;
      if (path.startsWith('/hayat_b2b')) return 'hayat_b2b';
      if (path.startsWith('/hayat_admin')) return 'hayat_admin';
      if (path.startsWith('/hayat_b2e')) return 'hayat_b2e';
      return 'hayat_b2c';
    };

    setHayatTenant(determineHayatTenant());
  }, [location]);

  return (
    <HayatTenantContext.Provider value={{ hayatTenant, setHayatTenant }}>
      {children}
    </HayatTenantContext.Provider>
  );
};
