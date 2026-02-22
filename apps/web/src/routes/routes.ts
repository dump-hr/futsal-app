interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  HOME: '/',
  ADMIN: '/admin',
  TEAMS: '/admin/teams',
  GROUPS: '/admin/groups',
  MATCHES: '/admin/matches',
};
