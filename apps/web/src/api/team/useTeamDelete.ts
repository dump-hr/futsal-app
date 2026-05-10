import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TeamDto } from '@futsal-app/types';

const teamDelete = (id: number) => {
  return api.delete<never, TeamDto>(`/team/${id}`);
};

export const useTeamDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
      toast.success('Ekipa uspješno obrisana');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
