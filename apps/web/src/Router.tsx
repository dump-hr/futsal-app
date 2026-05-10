import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { BackgroundLayout, NavbarLayout } from '@layouts/index';
import {
  LoginPage,
  StartingPage,
  TeamDetailPage,
  TeamsPage,
  MatchesPage,
  MatchTimerPage,
  GroupsPage,
} from '@pages/index';
import { ProtectedRoute } from '@components/index';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
      <ProtectedRoute>
        <Switch>
          <Route path={routes.MATCH_TIMER} component={MatchTimerPage} />
          <Route>
            <NavbarLayout>
              <BackgroundLayout>
                <Route path={routes.ADMIN_HOME} component={StartingPage} />
                <Route path={routes.TEAM_DETAIL} component={TeamDetailPage} />
                <Route path={routes.TEAMS} component={TeamsPage} />
                <Route path={routes.MATCHES} component={MatchesPage} />
                <Route path={routes.GROUPS} component={GroupsPage} />
              </BackgroundLayout>
            </NavbarLayout>
          </Route>
        </Switch>
      </ProtectedRoute>
    </Switch>
  );
};
