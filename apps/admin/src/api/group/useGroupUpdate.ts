import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { GroupUpdateDto, GroupDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

const groupUpdate = (id: number, dto: GroupUpdateDto) => {
  return api.patch<GroupUpdateDto, GroupDto>(`/group/${id}`, dto);
};

export const useGroupUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: GroupUpdateDto }) =>
      groupUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
      toast.success('Skupina uspješno ažurirana');
    },
    onError: (error) => {
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
