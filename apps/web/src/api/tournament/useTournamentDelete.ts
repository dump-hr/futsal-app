import { api } from '@api/base';
import { TournamentDto } from '@futsal-app/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const tournamentDelete = (id: number) => {
  return api.delete<never, TournamentDto>(`/tournament/${id}`);
};

export const useTournamentDelete = (tournamentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tournamentDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournament', tournamentId],
      });
    },
    onError: (error) => {
      toast.error(`Greška pri brisanju turnira - ${error.message}`);
    },
  });
};
