import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchEventDto } from '@futsal-app/types';

const matchEventDelete = (id: number) => {
  return api.delete<never, MatchEventDto>(`/match-event/${id}`);
};

export const useMatchEventDelete = (matchId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchEventDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['matchEvents', matchId],
      });
      queryClient.invalidateQueries({
        queryKey: ['match', matchId],
      });
      toast.success('Event uspješno obrisan');
    },
    onError: (error) => {
      toast.error(`Greška pri brisanju eventa - ${error.message}`);
    },
  });
};
