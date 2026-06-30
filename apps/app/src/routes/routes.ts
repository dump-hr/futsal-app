interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  HOME: '/',
  GROUPS: '/groups',
  DRAW: '/draw',
  MATCHES: '/matches',
  TEAMS: '/teams',
  TEAM_DETAIL: '/teams/:teamId',
};
