import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { PlayerDto } from '@futsal-app/types';

const playerDelete = (id: number) => {
  return api.delete<never, PlayerDto>(`/player/${id}`);
};

export const usePlayerDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Igrač uspješno obrisan');
    },
    onError: (error) => {
      toast.error(`Greška pri brisanju igrača - ${error.message}`);
    },
  });
};
