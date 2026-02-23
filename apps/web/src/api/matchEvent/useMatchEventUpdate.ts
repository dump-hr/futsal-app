import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../base';
import { MatchEventUpdateDto, MatchEventDto } from '@futsal-app/types';

const matchEventUpdate = (id: number, dto: MatchEventUpdateDto) => {
  return api.patch<MatchEventUpdateDto, MatchEventDto>(
    `/match-event/${id}`,
    dto,
  );
};

export const useMatchEventUpdate = (matchId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: MatchEventUpdateDto }) =>
      matchEventUpdate(id, dto),
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
