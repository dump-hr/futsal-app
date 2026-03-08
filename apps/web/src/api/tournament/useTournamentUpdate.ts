import { api } from '@api/base';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const tournamentUpdate = (id: number) => {
  return api.put<TournamentModifyDto, TournamentDto>(`/tournament/${id}`);
};

export const useTournamentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tournamentUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournament'],
      });
    },
    onError: (error) => {
      toast.error(`Greška pri ažuriranju turnira - ${error.message}`);
    },
  });
};
