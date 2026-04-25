import { useMutation } from '@tanstack/react-query';
import { LoginDto, JwtResponseDto } from '@futsal-app/types';
import { useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { api } from '../base';
import { routes } from '@routes/routes';

const login = (dto: LoginDto) => {
  return api.post<LoginDto, JwtResponseDto>('/auth/admin/login', dto);
};

export const useLogin = () => {
  const [, navigate] = useLocation();

  return useMutation({
    mutationFn: login,
    mutationKey: ['auth'],
    onSuccess: (data) => {
      localStorage.setItem('jwt', data.accessToken);
      navigate(routes.ADMIN_HOME);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
