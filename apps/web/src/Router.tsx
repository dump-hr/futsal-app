import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { BackgroundLayout } from '@layouts/BackgroundLayout/BackgroundLayout';
import { NavbarLayout } from '@layouts/NavbarLayout/NavbarLayout';
import { HomePage } from './pages/HomePage/HomePage';
import { TeamsPage } from './pages/TeamsPage/TeamsPage';
import { TeamDetailPage } from './pages/TeamDetailPage/TeamDetailPage';
import { MatchesPage } from './pages/MatchesPage/MatchesPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from '@components/ProtectedRoute/ProtectedRoute';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
      <ProtectedRoute>
        <NavbarLayout>
          <BackgroundLayout>
            <Route path={routes.ADMIN} component={HomePage} />
            <Route path={routes.TEAM_DETAIL} component={TeamDetailPage} />
            <Route path={routes.TEAMS} component={TeamsPage} />
            <Route path={routes.MATCHES} component={MatchesPage} />
          </BackgroundLayout>
        </NavbarLayout>
      </ProtectedRoute>
    </Switch>
  );
};
