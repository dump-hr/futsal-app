import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { BackgroundLayout } from '@layouts/BackgroundLayout/BackgroundLayout';
import { NavbarLayout } from '@layouts/NavbarLayout/NavbarLayout';
import { HomePage } from './pages/HomePage/HomePage';

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
