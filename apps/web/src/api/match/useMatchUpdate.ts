import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchDto, MatchUpdateDto } from '@futsal-app/types';

const matchUpdate = ({ id, dto }: { id: number; dto: MatchUpdateDto }) => {
  return api.patch<MatchUpdateDto, MatchDto>(`/match/${id}`, dto);
};

export const useMatchUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchUpdate,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match', id] });
      toast.success('Utakmica uspješno ažurirana');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
