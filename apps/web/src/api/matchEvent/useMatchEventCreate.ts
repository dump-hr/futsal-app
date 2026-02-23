import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../base';
import { MatchEventCreateDto, MatchEventDto } from '@futsal-app/types';

const matchEventCreate = (dto: MatchEventCreateDto) => {
  return api.post<MatchEventCreateDto, MatchEventDto>('/match-event', dto);
};

export const useMatchEventCreate = (matchId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchEventCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['matchEvents', matchId],
      });
    },
  });
};
