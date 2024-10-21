import { lazy } from 'react';

export const loadTenantComponent = (tenant: string, componentName: string) => {
  return lazy(() => import(`../components/${tenant}/${componentName}`));
};
