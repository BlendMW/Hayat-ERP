import { lazy } from 'react';
import { tenantConfigs } from '../config/tenantConfig';

export const loadTenantComponent = (tenant: string, componentName: string) => {
  return lazy(() => import(`../components/${tenant}/${componentName}`));
};

export const getTenantConfig = (tenantId: string) => {
  return tenantConfigs[tenantId] || {};
};

export const getApiConfig = (tenantId: string, apiName: string) => {
  const tenantConfig = getTenantConfig(tenantId);
  return tenantConfig.apis?.[apiName] || {};
};
