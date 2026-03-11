import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { TeamCreateDto, TeamDto } from '@futsal-app/types';

const teamCreate = (dto: TeamCreateDto) => {
  return api.post<TeamCreateDto, TeamDto>('/team', dto);
};

export const useTeamCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
    },
    onError: (error) => {
      toast.error(`Greška pri kreiranju ekipe - ${error.message}`);
    },
  });
};
