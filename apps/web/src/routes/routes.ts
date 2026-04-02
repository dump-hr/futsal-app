interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  HOME: '/',
  LOGIN: '/admin/login',
  ADMIN: '/admin',
  TEAMS: '/admin/teams',
  TEAM_DETAIL: '/admin/teams/:teamId',
  GROUPS: '/admin/groups',
  MATCHES: '/admin/matches',
};
