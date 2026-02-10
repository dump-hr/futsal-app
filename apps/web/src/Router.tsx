import { Route, Switch } from 'wouter';
import { routes } from './routes/index';
import { HomePage } from './pages/HomePage';

export const Router = () => {
  return (
    <Switch>
      <NavbarLayout>
        <BackgroundLayout>
          <Route path={routes.ADMIN} component={HomePage} />
        </BackgroundLayout>
      </NavbarLayout>
    </Switch>
  );
};
