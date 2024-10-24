import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHayatTenant } from '../hayatHooks/useHayatTenant';
import { hayatLoadTenantComponent } from '../hayatUtils/hayatTenantUtils';

const HayatTenantRouter: React.FC = () => {
  const { hayatTenant } = useHayatTenant();

  const HayatHomePage = hayatLoadTenantComponent(hayatTenant, 'HayatHomePage');
  const HayatSearchPage = hayatLoadTenantComponent(hayatTenant, 'HayatSearchPage');
  const HayatBookingPage = hayatLoadTenantComponent(hayatTenant, 'HayatBookingPage');
  const HayatProfilePage = hayatLoadTenantComponent(hayatTenant, 'HayatProfilePage');
  const HayatManagementPage = hayatLoadTenantComponent(hayatTenant, 'HayatManagementPage');

  return (
    <Suspense fallback={<div>Loading Hayat Portal...</div>}>
      <Switch>
        <Route exact path={`/${hayatTenant}`} component={HayatHomePage} />
        <Route path={`/${hayatTenant}/search`} component={HayatSearchPage} />
        <Route path={`/${hayatTenant}/booking`} component={HayatBookingPage} />
        <Route path={`/${hayatTenant}/profile`} component={HayatProfilePage} />
        <Route path={`/${hayatTenant}/management`} component={HayatManagementPage} />
      </Switch>
    </Suspense>
  );
};

export default HayatTenantRouter;
