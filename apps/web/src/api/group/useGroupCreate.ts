import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GroupCreateDto, GroupDto } from '@futsal-app/types';

const groupCreate = (dto: GroupCreateDto) => {
  return api.post<GroupCreateDto, GroupDto>('/group', dto);
};

export const useGroupCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      toast.success('Grupa uspješno kreirana');
    },
    onError: (error) => {
      toast.error(`Greška pri kreiranju grupe - ${error.message}`);
    },
  });
};
