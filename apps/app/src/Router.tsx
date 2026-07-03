import { Route, Switch } from 'wouter';
import { routes } from '@routes/index';

import {
  HomePage,
  MatchesPage,
  MatchDetailPage,
  DrawPage,
  TeamsPage,
  TeamDetailPage,
  GroupsPage,
  NotFoundPage,
} from '@pages/index';
import { NavbarLayout } from '@layouts/index';

export const Router = () => {
  return (
    <NavbarLayout>
      <Switch>
        <Route path={routes.HOME} component={HomePage} />
        <Route path={routes.MATCH_DETAIL} component={MatchDetailPage} />
        <Route path={routes.MATCHES} component={MatchesPage} />
        <Route path={routes.DRAW} component={DrawPage} />
        <Route path={routes.TEAM_DETAIL} component={TeamDetailPage} />
        <Route path={routes.TEAMS} component={TeamsPage} />
        <Route path={routes.GROUPS} component={GroupsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </NavbarLayout>
  );
};
