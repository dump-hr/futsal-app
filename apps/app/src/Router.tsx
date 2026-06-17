import { Route, Switch } from 'wouter';
import { routes } from '@routes/index';
import { HomePage, DrawPage } from '@pages/index';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
      <Route path={routes.DRAW} component={DrawPage} />
    </Switch>
  );
};
