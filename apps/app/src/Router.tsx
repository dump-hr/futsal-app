import { Route, Switch } from 'wouter';
import { HomePage } from '@pages/index';

export const Router = () => {
  return (
    <Switch>
      <Route path={''} component={HomePage} />
    </Switch>
  );
};
