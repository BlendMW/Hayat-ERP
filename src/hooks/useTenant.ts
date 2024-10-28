import { useContext } from 'react';
import { TenantContext } from '../contexts/TenantContext';
import { getTenantConfig } from '../utils/tenantUtils';

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  const { tenant } = context;
  const tenantConfig = getTenantConfig(tenant);

  return {
    tenant,
    tenantConfig,
  };
};
