import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { HomePage } from './pages/HomePage/HomePage';
import { ComponentTestPage } from '@pages/ComponentTestPage/ComponentTestPage';

export const Router = () => {
  return (
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
      <Route path={'/component-test'} component={ComponentTestPage} />
    </Switch>
  );
};
