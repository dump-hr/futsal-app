import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    },
  });
};
