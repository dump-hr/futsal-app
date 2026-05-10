import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';

const matchDelete = (id: number) => {
  return api.delete<never, void>(`/match/${id}`);
};

export const useMatchDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Utakmica uspješno obrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
