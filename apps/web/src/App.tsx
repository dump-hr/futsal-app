import { Toaster } from 'react-hot-toast';
import './App.css';
import { Route, Switch } from 'wouter';

const homePage = () => {
  return <p>home</p>;
};

function App() {
  return (
    <>
      <Switch>
        <Route path={'/'} component={homePage} />
        <Route
          path={'/some-other-page'}
          component={() => <h1>some other page</h1>}
        />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
