import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type HayatTenant = 'hayat_b2c' | 'hayat_b2b' | 'hayat_admin' | 'hayat_b2e';

interface HayatTenantContextType {
  hayatTenant: HayatTenant;
  setHayatTenant: React.Dispatch<React.SetStateAction<HayatTenant>>;
}

export const HayatTenantContext = createContext<HayatTenantContextType | undefined>(undefined);

interface HayatTenantProviderProps {
  children: ReactNode;
}

export const HayatTenantProvider: React.FC<HayatTenantProviderProps> = ({ children }) => {
  const [hayatTenant, setHayatTenant] = useState<HayatTenant>('hayat_b2c');
  const navigate = useNavigate();

  useEffect(() => {
    // Logic to determine the tenant based on the current route
    const path = location.pathname;
    if (path.startsWith('/b2b')) {
      setHayatTenant('hayat_b2b');
    } else if (path.startsWith('/admin')) {
      setHayatTenant('hayat_admin');
    } else if (path.startsWith('/b2e')) {
      setHayatTenant('hayat_b2e');
    } else {
      setHayatTenant('hayat_b2c');
    }
  }, [location]);

  return (
    <HayatTenantContext.Provider value={{ hayatTenant, setHayatTenant }}>
      {children}
    </HayatTenantContext.Provider>
  );
};
