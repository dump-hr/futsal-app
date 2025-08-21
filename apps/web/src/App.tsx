import { Toaster } from 'react-hot-toast';
import './App.css';
import { Route, Switch } from 'wouter';
import { Controller, useForm } from 'react-hook-form';
import { useTournamentCreate } from './api/tournament/useTournamentCreate';

type TournamentFormData = {
  name: string;
};

const HomePage = () => {
  const createTournament = useTournamentCreate();

  const { handleSubmit, control } = useForm<TournamentFormData>();

  return (
    <div>
      <form onSubmit={handleSubmit((data) => createTournament.mutate(data))}>
        <Controller
          defaultValue=''
          control={control}
          name='name'
          render={({ field: { onChange, onBlur, value } }) => (
            <input onChange={onChange} onBlur={onBlur} value={value} />
          )}
        />

        <button>Submit</button>
      </form>
    </div>
  );
};

function App() {
  return (
    <>
      <Switch>
        <Route path={'/'} component={HomePage} />
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
