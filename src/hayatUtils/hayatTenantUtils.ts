import { lazy } from 'react';

export const hayatLoadTenantComponent = (tenant: string, componentName: string) => {
  return lazy(() => import(`../components/${tenant}/${componentName}`));
};
