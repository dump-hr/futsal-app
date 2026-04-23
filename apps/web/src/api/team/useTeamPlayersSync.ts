import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { PlayerDto, TeamPlayersSyncDto } from '@futsal-app/types';

const teamPlayersSync = (teamId: number, dto: TeamPlayersSyncDto) => {
  return api.put<TeamPlayersSyncDto, PlayerDto[]>(
    `/team/${teamId}/players`,
    dto,
  );
};

export const useTeamPlayersSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      dto,
    }: {
      teamId: number;
      dto: TeamPlayersSyncDto;
    }) => teamPlayersSync(teamId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
    onError: (error) => {
      toast.error(`Greška pri spremanju igrača - ${error.message}`);
    },
  });
};
