import { useState } from 'react';
import { Button, Input } from '@components/index';
import { useLogin } from '@api/auth/useLogin';
import arrowRightBlack from '@assets/icons/arrow-right-black.svg';
import c from './LoginPage.module.scss';

export const LoginPage = () => {
  const [admin, setAdmin] = useState({ username: '', password: '' });
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(admin);
  };

  return (
    <div className={c.wrapper}>
      <form className={c.form} onSubmit={handleSubmit}>
        <h1 className={c.title}>Pozdrav!</h1>
        <div className={c.inputs}>
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
        </div>
        <Button
          icon={arrowRightBlack}
          variant='green'
          type='submit'
          disabled={isPending}
        >
          {isPending ? 'Prijava...' : 'Prijavi se'}
        </Button>
      </form>
    </div>
  );
};
