import { useContext, useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { routes } from '@routes/index';
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
import { TournamentContext } from '@context/index';

export const Router = () => {
  const { tournamentId, isLoading } = useContext(TournamentContext) ?? {
    tournamentId: null,
    isLoading: false,
  };
  const [location] = useLocation();

  const needsTournament =
    !isLoading &&
    tournamentId === null &&
    location !== routes.LOGIN &&
    location !== routes.ADMIN_HOME;

  useEffect(() => {
    if (needsTournament) {
      toast.error('Prvo započnite turnir kako biste pristupili ovoj stranici', {
        id: 'no-tournament',
      });
    }
  }, [needsTournament]);

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
