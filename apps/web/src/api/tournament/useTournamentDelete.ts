import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TournamentDto } from '@futsal-app/types';

const tournamentDelete = (id: number) => {
  return api.delete<never, TournamentDto>(`/tournament/${id}`);
};

export const useTournamentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tournamentDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Turnir uspješno obrisan');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
