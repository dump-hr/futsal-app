import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TeamUpdateDto, TeamDto } from '@futsal-app/types';

const teamUpdate = (id: number, dto: TeamUpdateDto) => {
  return api.patch<TeamUpdateDto, TeamDto>(`/team/${id}`, dto);
};

export const useTeamUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: TeamUpdateDto }) =>
      teamUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Ekipa uspješno ažurirana');
    },
    onError: (error) => {
      toast.error(`Greška pri ažuriranju ekipe - ${error.message}`);
    },
  });
};
