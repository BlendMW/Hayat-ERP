import { lazy } from 'react';
import { TenantConfig } from '../types/tenant';
import { TenantModel } from '../../models';

const tenantConfig: Record<string, TenantConfig> = {
  b2c: { theme: 'b2c-theme', logo: 'b2c-logo.png' },
  b2b: { theme: 'b2b-theme', logo: 'b2b-logo.png' },
  admin: { theme: 'admin-theme', logo: 'admin-logo.png' },
  b2e: { theme: 'b2e-theme', logo: 'b2e-logo.png' },
};

export const loadTenantComponent = (tenant: string, componentName: string) => {
  return lazy(() => import(`../components/${tenant}/${componentName}`));
};

export const getTenantConfig = (tenantId: string): TenantConfig => {
  return tenantConfig[tenantId] || { theme: 'default-theme', logo: 'default-logo.png' };
};

export const getApiConfig = (tenantId: string, apiName: string) => {
  const tenantConfig = getTenantConfig(tenantId);
  return tenantConfig.apis?.[apiName] || {};
};
