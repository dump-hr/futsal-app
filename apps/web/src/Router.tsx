import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { HomePage } from './pages/HomePage/HomePage';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  );
};
