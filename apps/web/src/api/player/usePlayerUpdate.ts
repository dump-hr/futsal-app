import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { PlayerUpdateDto, PlayerDto } from '@futsal-app/types';

const playerUpdate = (id: number, dto: PlayerUpdateDto) => {
  return api.patch<PlayerUpdateDto, PlayerDto>(`/player/${id}`, dto);
};

export const usePlayerUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: PlayerUpdateDto }) =>
      playerUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['players'],
      });
    },
    onError: (error) => {
      toast.error(`Greška pri ažuriranju igrača - ${error.message}`);
    },
  });
};
