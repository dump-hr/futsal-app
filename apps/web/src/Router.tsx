import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { HomePage } from './pages/HomePage';
import { BackgroundLayout } from '@layouts/BackgroundLayout/BackgroundLayout';
import { NavbarLayout } from '@layouts/NavbarLayout';
import { Group } from './components/Group/Group';

export const Router = () => {
  return (
    <Switch>
      <NavbarLayout>
        <BackgroundLayout>
          <Route path={routes.ADMIN} component={HomePage} />
          <Route path={routes.HOME} component={Group} />
        </BackgroundLayout>
      </NavbarLayout>
    </Switch>
  );
};
