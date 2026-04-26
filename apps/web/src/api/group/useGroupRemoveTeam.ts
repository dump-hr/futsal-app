import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GroupDto } from '@futsal-app/types';

const groupRemoveTeam = (id: number, teamId: number) => {
  return api.delete<never, GroupDto>(`/group/${id}/team/${teamId}`);
};

export const useGroupRemoveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, teamId }: { id: number; teamId: number }) =>
      groupRemoveTeam(id, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
      toast.success('Ekipa uspješno uklonjena iz grupe');
    },
    onError: (error) => {
      toast.error(`Greška pri uklanjanju ekipe iz grupe - ${error.message}`);
    },
  });
};
