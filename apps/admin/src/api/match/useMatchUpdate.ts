import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchDto, MatchUpdateDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const updateMatch = (matchId: number, dto: MatchUpdateDto) => {
  return api.patch<MatchUpdateDto, MatchDto>(`/match/${matchId}`, dto);
};

export const useMatchUpdate = (matchId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: MatchUpdateDto) => updateMatch(matchId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Utakmica uspješno ažurirana');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
