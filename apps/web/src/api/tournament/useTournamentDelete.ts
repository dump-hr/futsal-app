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
      toast.success('Tournament deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting tournament - ${error.message}`);
    },
  });
};
