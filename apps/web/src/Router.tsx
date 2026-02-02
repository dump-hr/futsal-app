import { Route, Switch } from 'wouter';
import { HomePage } from './pages/index';
import { routes } from './routes/index';
import { NavbarLayout, BackgroundLayout } from '@layouts/index';

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
