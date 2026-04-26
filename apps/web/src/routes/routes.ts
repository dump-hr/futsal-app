interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  ADMIN_HOME: '/admin',
  LOGIN: '/admin/login',
  TEAMS: '/admin/teams',
  TEAM_DETAIL: '/admin/teams/:teamId',
  GROUPS: '/admin/groups',
  MATCHES: '/admin/matches',
};
