import { useContext } from 'react';
import { Redirect, Route, Switch, useLocation } from 'wouter';
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
import { TournamentContext } from 'context/TournamentContext';

export const Router = () => {
  const { tournamentId } = useContext(TournamentContext);
  const [location] = useLocation();

  const needsTournament =
    tournamentId === null &&
    location !== routes.LOGIN &&
    location !== routes.ADMIN_HOME;

  return (
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
      <ProtectedRoute>
        {needsTournament ? (
          <Redirect to={routes.ADMIN_HOME} />
        ) : (
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
        )}
      </ProtectedRoute>
    </Switch>
  );
};
