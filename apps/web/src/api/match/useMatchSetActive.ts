import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';

const matchSetActive = (id: number) => {
  return api.patch<never, void>(`/match/${id}/activate`);
};

export const useMatchSetActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchSetActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Utakmica gotova');
    },
    onError: (error) => {
      toast.error(`Greška pri aktiviranju utakmice - ${error.message}`);
    },
  });
};
