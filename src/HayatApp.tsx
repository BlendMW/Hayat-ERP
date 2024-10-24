import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { HayatTenantProvider } from './hayatContexts/HayatTenantContext';
import { useHayatTenant } from './hayatHooks/useHayatTenant';
import { hayatLoadTenantComponent } from './hayatUtils/hayatTenantUtils';
import HayatLogin from './hayatComponents/shared/HayatLogin';

// HayatAuth: Mock authentication function for the Hayat platform
const hayatAuth = {
  isAuthenticated: false,
  signin(callback: () => void) {
    hayatAuth.isAuthenticated = true;
    setTimeout(callback, 100);
  },
  signout(callback: () => void) {
    hayatAuth.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

const HayatPrivateRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      hayatAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      )
    }
  />
);

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
        <HayatPrivateRoute exact path={`/${hayatTenant}`} component={HayatHomePage} />
        <HayatPrivateRoute path={`/${hayatTenant}/search`} component={HayatSearchPage} />
        <HayatPrivateRoute path={`/${hayatTenant}/booking`} component={HayatBookingPage} />
        <HayatPrivateRoute path={`/${hayatTenant}/profile`} component={HayatProfilePage} />
        <HayatPrivateRoute path={`/${hayatTenant}/management`} component={HayatManagementPage} />
      </Switch>
    </Suspense>
  );
};

const HayatApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    hayatAuth.signin(() => {
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
        <Switch>
          <Route path="/login" render={(props) => <HayatLogin {...props} onLogin={handleLogin} />} />
          <Route path="/">
            {isAuthenticated ? (
              <>
                <button onClick={handleLogout}>Logout from Hayat</button>
                <HayatTenantRouter />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </HayatTenantProvider>
    </Router>
  );
};

export default HayatApp;
