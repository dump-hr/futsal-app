interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  HOME: '/',
  GROUPS: '/groups',
  DRAW: '/draw',
  MATCHES: '/matches',
  MATCH_DETAIL: '/matches/:matchId',
  TEAMS: '/teams',
  TEAM_DETAIL: '/teams/:teamId',
};
