interface RouteType {
  [key: string]: string;
}

export const routes: RouteType = {
  HOME: '/',
  GROUPS: '/skupine',
  DRAW: '/zdrijeb',
  MATCHES: '/utakmice',
  TEAMS: '/ekipe',
};
