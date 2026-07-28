import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const matchDeactivate = () => {
  return api.patch<never, void>('/match/deactivate');
};

export const useMatchDeactivate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchDeactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Utakmica uspješno deaktivirana');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
