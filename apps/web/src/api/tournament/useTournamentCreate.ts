import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '..';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';
import toast from 'react-hot-toast';

const tournamentCreate = (dto: TournamentModifyDto) => {
  return api.post<TournamentModifyDto, TournamentDto>('/tournament', dto);
};

export const useTournamentCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tournamentCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournament'],
      });
      toast.success('Tournament created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating tournament - ${error.message} `);
    },
  });
};
