import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Tenant = 'b2c' | 'b2b' | 'admin' | 'b2e';

interface TenantContextType {
  tenant: Tenant;
  setTenant: (tenant: Tenant) => void;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant>('b2c');
  const location = useLocation();

  useEffect(() => {
    const determineTenant = (): Tenant => {
      const path = location.pathname;
      if (path.startsWith('/b2b')) return 'b2b';
      if (path.startsWith('/admin')) return 'admin';
      if (path.startsWith('/b2e')) return 'b2e';
      return 'b2c';
    };

    setTenant(determineTenant());
  }, [location]);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};
