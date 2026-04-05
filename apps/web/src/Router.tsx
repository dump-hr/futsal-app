import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { BackgroundLayout } from '@layouts/BackgroundLayout/BackgroundLayout';
import { NavbarLayout } from '@layouts/NavbarLayout/NavbarLayout';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage';
import { GroupsPage } from './pages/GroupsPage';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
      <NavbarLayout>
        <BackgroundLayout>
          <Route path={routes.ADMIN} component={HomePage} />
          <Route path={routes.GROUPS} component={GroupsPage} />
        </BackgroundLayout>
      </NavbarLayout>
    </Switch>
  );
};
