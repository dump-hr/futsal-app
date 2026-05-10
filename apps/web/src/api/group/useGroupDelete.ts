import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GroupDto } from '@futsal-app/types';

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
      toast.success('Grupa uspješno obrisana');
    },
    onError: (error) => {
      toast.error(`Greška pri brisanju grupe - ${error.message}`);
    },
  });
};
