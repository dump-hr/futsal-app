import { Route, Switch } from 'wouter';
import { routes } from '@routes/index';
import { HomePage, MatchesPage, DrawPage } from '@pages/index';
import { NavbarLayout } from '@layouts/index';

export const Router = () => {
  return (
    <NavbarLayout>
      <Switch>
        <Route path={routes.HOME} component={HomePage} />
        <Route path={routes.MATCHES} component={MatchesPage} />
        <Route path={routes.DRAW} component={DrawPage} />
      </Switch>
    </NavbarLayout>
  );
};
