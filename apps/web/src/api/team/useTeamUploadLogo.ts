import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TeamDto } from '@futsal-app/types';

const teamUploadLogo = (teamId: number, file: File) => {
  const data = new FormData();
  data.append('file', file);
  return api.patchForm<FormData, TeamDto>(`/team/${teamId}/logo`, data);
};

export const useTeamUploadLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, file }: { teamId: number; file: File }) =>
      teamUploadLogo(teamId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Logo uspješno uploadan');
    },
    onError: (error) => {
      toast.error(`Greška pri uploadu loga - ${error.message}`);
    },
  });
};
