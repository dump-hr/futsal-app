import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GroupDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const groupDelete = (id: number) => {
  return api.delete<never, GroupDto>(`/group/${id}`);
};

export const useGroupDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
      toast.success('Skupina uspješno obrisana');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
