import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { PlayerCreateDto, PlayerDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const playerCreate = (dto: PlayerCreateDto) => {
  return api.post<PlayerCreateDto, PlayerDto>('/player', dto);
};

export const usePlayerCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Igrač uspješno kreiran');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
