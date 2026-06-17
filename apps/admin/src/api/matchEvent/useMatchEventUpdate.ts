import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchEventUpdateDto, MatchEventDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

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
      toast.success('Event uspješno ažuriran');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
