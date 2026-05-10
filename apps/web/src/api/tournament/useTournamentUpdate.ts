import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';

const tournamentUpdate = (id: number, dto: TournamentModifyDto) => {
  return api.patch<TournamentModifyDto, TournamentDto>(`/tournament/${id}`, dto);
};

export const useTournamentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: TournamentModifyDto }) =>
      tournamentUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Turnir uspješno ažuriran');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
