import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TeamDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const teamDeleteLogo = (teamId: number) => {
  return api.delete<never, TeamDto>(`/team/${teamId}/logo`);
};

export const useTeamDeleteLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamDeleteLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Logo uspješno obrisan');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
