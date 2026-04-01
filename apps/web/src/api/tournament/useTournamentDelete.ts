import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../base';
import toast from 'react-hot-toast';

const tournamentDelete = (id: number) => {
  return api.delete(`/tournament/${id}`);
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
