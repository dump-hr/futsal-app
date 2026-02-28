import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchEventCreateDto, MatchEventDto } from '@futsal-app/types';

const matchEventCreate = (dto: MatchEventCreateDto) => {
  return api.post<MatchEventCreateDto, MatchEventDto>('/match-event', dto);
};

export const useMatchEventCreate = (
  matchId: number,
  options?: { onSuccess?: () => void },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchEventCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['matchEvents', matchId],
      });
      queryClient.invalidateQueries({
        queryKey: ['match', matchId],
      });
    },
    onError: (error) => {
      toast.error(`Greška pri kreiranju eventa - ${error.message}`);
    },
  });
};
