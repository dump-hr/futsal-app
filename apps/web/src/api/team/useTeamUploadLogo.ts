import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TeamDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const teamUploadLogo = ({ teamId, file }: { teamId: number; file: File }) => {
  const data = new FormData();
  data.append('file', file);
  return api.patchForm<FormData, TeamDto>(`/team/${teamId}/logo`, data);
};

export const useTeamUploadLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamUploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Logo uspješno učitan');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
