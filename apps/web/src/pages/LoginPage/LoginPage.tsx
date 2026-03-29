import { useState } from 'react';
import Input from '@components/Input/Input';
import { useLogin } from '@api/auth/useLogin';
import { useTournamentCreate } from '@api/tournament/useTournamentCreate';
import c from './LoginPage.module.scss';

export const LoginPage = () => {
  const [admin, setAdmin] = useState({ username: '', password: '' });
  const { mutate: login, isPending } = useLogin();
  const { mutate: createTournament } = useTournamentCreate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(admin);
  };

  return (
    <div className={c.wrapper}>
      <form className={c.form} onSubmit={handleSubmit}>
        <h1 className={c.title}>Admin prijava</h1>
        <Input
          label='Korisničko ime'
          placeholder='Unesite korisničko ime'
          value={admin.username}
          onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
        />
        <Input
          label='Lozinka'
          placeholder='Unesite lozinku'
          type='password'
          value={admin.password}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
        />
        <button
          style={{ color: 'black' }}
          className={c.button}
          type='submit'
          disabled={isPending}>
          {isPending ? 'Prijava...' : 'Prijava'}
        </button>
      </form>
      <button onClick={() => createTournament({ name: 'Test Tournament' })}>
        Test create tournament (should fail)
      </button>
    </div>
  );
};
