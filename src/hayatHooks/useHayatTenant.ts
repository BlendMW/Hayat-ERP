import { useContext } from 'react';
import { HayatTenantContext } from '../hayatContexts/HayatTenantContext';

export const useHayatTenant = () => {
  const context = useContext(HayatTenantContext);
  if (context === undefined) {
    throw new Error('useHayatTenant must be used within a HayatTenantProvider');
  }
  return context;
};
