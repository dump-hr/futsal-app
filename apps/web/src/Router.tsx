import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { BackgroundLayout, NavbarLayout } from '@layouts/index';
import {
  HomePage,
  LoginPage,
  StartingPage,
  TeamDetailPage,
  TeamsPage,
  MatchesPage,
  GroupsPage,
} from '@pages/index';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
      <NavbarLayout>
        <BackgroundLayout>
          <Route path={routes.ADMIN} component={HomePage} />
          <Route path={routes.ADMIN_HOME} component={StartingPage} />
          <Route path={routes.TEAM_DETAIL} component={TeamDetailPage} />
          <Route path={routes.TEAMS} component={TeamsPage} />
          <Route path={routes.MATCHES} component={MatchesPage} />
          <Route path={routes.GROUPS} component={GroupsPage} />
        </BackgroundLayout>
      </NavbarLayout>
    </Switch>
  );
};
