import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
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
      <Routes>
        <Route path={`/${hayatTenant}`} element={<HayatHomePage />} />
        <Route path={`/${hayatTenant}/search`} element={<HayatSearchPage />} />
        <Route path={`/${hayatTenant}/booking`} element={<HayatBookingPage />} />
        <Route path={`/${hayatTenant}/profile`} element={<HayatProfilePage />} />
        <Route path={`/${hayatTenant}/management`} element={<HayatManagementPage />} />
      </Routes>
    </Suspense>
  );
};

export default HayatTenantRouter;
