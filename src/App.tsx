import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { TenantProvider } from './contexts/TenantContext';
import { useTenant } from './hooks/useTenant';
import { loadTenantComponent } from './utils/tenantUtils';
import Login from './components/shared/Login';

// Mock authentication function
const fakeAuth = {
  isAuthenticated: false,
  signin(callback: () => void) {
    fakeAuth.isAuthenticated = true;
    setTimeout(callback, 100);
  },
  signout(callback: () => void) {
    fakeAuth.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

const PrivateRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      )
    }
  />
);

const TenantRouter: React.FC = () => {
  const { tenant } = useTenant();

  const HomePage = loadTenantComponent(tenant, 'HomePage');
  const SearchPage = loadTenantComponent(tenant, 'SearchPage');
  const BookingPage = loadTenantComponent(tenant, 'BookingPage');
  const ProfilePage = loadTenantComponent(tenant, 'ProfilePage');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <PrivateRoute exact path={`/${tenant}`} component={HomePage} />
        <PrivateRoute path={`/${tenant}/search`} component={SearchPage} />
        <PrivateRoute path={`/${tenant}/booking`} component={BookingPage} />
        <PrivateRoute path={`/${tenant}/profile`} component={ProfilePage} />
      </Switch>
    </Suspense>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    fakeAuth.signin(() => {
      setIsAuthenticated(true);
    });
  };

  const handleLogout = () => {
    fakeAuth.signout(() => {
      setIsAuthenticated(false);
    });
  };

  return (
    <Router>
      <TenantProvider>
        <Switch>
          <Route path="/login" render={(props) => <Login {...props} onLogin={handleLogin} />} />
          <Route path="/">
            {isAuthenticated ? (
              <>
                <button onClick={handleLogout}>Logout</button>
                <TenantRouter />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </TenantProvider>
    </Router>
  );
};

export default App;
