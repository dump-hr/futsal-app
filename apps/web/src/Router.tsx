import { Route, Switch } from 'wouter';
import { HomePage } from 'pages/index';
import { routes } from 'routes/index';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  );
};
