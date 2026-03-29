interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  HOME: '/',
  LOGIN: '/admin/login',
  ADMIN: '/admin',
  TEAMS: '/admin/teams',
  GROUPS: '/admin/groups',
  MATCHES: '/admin/matches',
};
