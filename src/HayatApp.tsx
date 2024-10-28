import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HayatTenantProvider } from './hayatContexts/HayatTenantContext';
import { useHayatTenant } from './hayatHooks/useHayatTenant';
import { hayatLoadTenantComponent } from './hayatUtils/hayatTenantUtils';
import HayatLogin from './components/shared/HayatLogin';

// HayatAuth: Mock authentication function for the Hayat platform
const hayatAuth = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout(cb: () => void) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const HayatPrivateRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  return hayatAuth.isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

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
        <Route path={`/${hayatTenant}`} element={<HayatPrivateRoute component={HayatHomePage} />} />
        <Route path={`/${hayatTenant}/search`} element={<HayatPrivateRoute component={HayatSearchPage} />} />
        <Route path={`/${hayatTenant}/booking`} element={<HayatPrivateRoute component={HayatBookingPage} />} />
        <Route path={`/${hayatTenant}/profile`} element={<HayatPrivateRoute component={HayatProfilePage} />} />
        <Route path={`/${hayatTenant}/management`} element={<HayatPrivateRoute component={HayatManagementPage} />} />
      </Routes>
    </Suspense>
  );
};

const HayatApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    hayatAuth.authenticate(() => {
      setIsAuthenticated(true);
    });
  };

  const handleLogout = () => {
    hayatAuth.signout(() => {
      setIsAuthenticated(false);
    });
  };

  return (
    <Router>
      <HayatTenantProvider>
        <Routes>
          <Route path="/login" element={<HayatLogin onLogin={handleLogin} />} />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <>
                  <button onClick={handleLogout}>Logout from Hayat</button>
                  <HayatTenantRouter />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </HayatTenantProvider>
    </Router>
  );
};

export default HayatApp;
