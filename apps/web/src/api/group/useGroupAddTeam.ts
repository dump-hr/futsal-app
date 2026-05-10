import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GroupAddTeamDto, GroupDto } from '@futsal-app/types';

const groupAddTeam = (id: number, dto: GroupAddTeamDto) => {
  return api.post<GroupAddTeamDto, GroupDto>(`/group/${id}/team`, dto);
};

export const useGroupAddTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: GroupAddTeamDto }) =>
      groupAddTeam(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
      toast.success('Ekipa uspješno dodana u skupinu');
    },
    onError: (error) => {
      toast.error(error.message || 'Došlo je do greške');
    },
  });
};
