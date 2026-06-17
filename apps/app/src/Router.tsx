import { Route, Switch } from 'wouter';

export const Router = () => {
  return (
    <Switch>
      <Route path={''} component={() => <div>Home</div>} />
    </Switch>
  );
};
