import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../base';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';
import toast from 'react-hot-toast';

const tournamentCreate = (dto: TournamentModifyDto) => {
  return api.post<TournamentModifyDto, TournamentDto>('/tournament', dto);
};

export const useTournamentCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tournamentCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Turnir uspješno kreiran');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
