import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const matchSetActive = (id: number) => {
  return api.patch<never, void>(`/match/${id}/activate`);
};

export const useMatchSetActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchSetActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Utakmica uspješno aktivirana');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
