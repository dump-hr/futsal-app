import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchCreateDto, MatchListDto } from '@futsal-app/types';

const matchCreate = (dto: MatchCreateDto) => {
  return api.post<MatchCreateDto, MatchListDto>('/match', dto);
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
      toast.error(`Greška pri kreiranju utakmice - ${error.message}`);
    },
  });
};
