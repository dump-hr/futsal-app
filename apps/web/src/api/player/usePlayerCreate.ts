import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { PlayerCreateDto, PlayerDto } from '@futsal-app/types';

const playerCreate = (dto: PlayerCreateDto) => {
  return api.post<PlayerCreateDto, PlayerDto>('/player', dto);
};

export const usePlayerCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['players'],
      });
      toast.success('Igrač uspješno kreiran');
    },
    onError: (error) => {
      toast.error(`Greška pri kreiranju igrača - ${error.message}`);
    },
  });
};
