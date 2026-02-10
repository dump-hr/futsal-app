import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { HomePage } from './pages/HomePage';
import { BackgroundLayout } from '@layouts/BackgrounLayout/BackgroundLayout';
import { NavbarLayout } from '@layouts/NavbarLayout';

export const Router = () => {
  return (
    <Switch>
      <NavbarLayout>
        <BackgroundLayout>
          <Route path={routes.ADMIN} component={HomePage} />
        </BackgroundLayout>
      </NavbarLayout>
    </Switch>
  );
};
