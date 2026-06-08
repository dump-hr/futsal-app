import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchCreateDto, MatchDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const matchCreate = (dto: MatchCreateDto) => {
  return api.post<MatchCreateDto, MatchDto>('/match', dto);
};

export const useMatchCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Utakmica uspješno kreirana');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
