import { Route, Switch } from 'wouter';
import { HomePage } from './pages/index';
import { routes } from './routes/index';
import { NavbarLayout } from '@layouts/NavbarLayout';

export const Router = () => {
  return (
    <Switch>
      <NavbarLayout>
        <Route path={routes.ADMIN} component={HomePage} />
      </NavbarLayout>
    </Switch>
  );
};
