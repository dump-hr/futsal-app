import { useState } from 'react';
import { Button, Input } from '@components/index';
import { useLogin } from '@api/index';
import { ArrowRightBlack } from '@assets/index';
import c from './LoginPage.module.scss';

export const LoginPage = () => {
  const [admin, setAdmin] = useState({ username: '', password: '' });
  const { mutate: login, isPending } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

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
            name='username'
            label='Korisničko ime'
            placeholder='Unesite korisničko ime'
            value={admin.username}
            onChange={handleChange}
          />
          <Input
            name='password'
            label='Lozinka'
            placeholder='Unesite lozinku'
            type='password'
            value={admin.password}
            onChange={handleChange}
          />
        </div>
        <Button
          icon={ArrowRightBlack}
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
