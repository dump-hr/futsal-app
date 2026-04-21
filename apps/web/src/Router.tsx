import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { BackgroundLayout, NavbarLayout } from '@layouts/index';
import { HomePage, LoginPage, StartingPage } from '@pages/index';
import { ProtectedRoute } from './components';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
      <ProtectedRoute>
        <NavbarLayout>
          <BackgroundLayout>
            <Route path={routes.ADMIN} component={HomePage} />
            <Route path={routes.STARTING} component={StartingPage} />
          </BackgroundLayout>
        </NavbarLayout>
      </ProtectedRoute>
    </Switch>
  );
};
