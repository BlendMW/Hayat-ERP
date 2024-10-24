import { useContext } from 'react';
import { TenantContext } from '../context/TenantContext';
import { getTenantConfig } from '../utils/tenantUtils';

export const useTenant = () => {
  const { tenant } = useContext(TenantContext);
  const tenantConfig = getTenantConfig(tenant);

  return {
    tenant,
    config: tenantConfig,
  };
};
