import { useMutation } from '@tanstack/react-query';
import { api } from '../base';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';
import toast from 'react-hot-toast';

const tournamentCreate = (dto: TournamentModifyDto) => {
  return api.post<TournamentModifyDto, TournamentDto>('/tournament', dto);
};

export const useTournamentCreate = () => {
  return useMutation({
    mutationFn: tournamentCreate,
    mutationKey: ['tournament'],
    onSuccess: () => toast.success('Tournament created successfully'),
    onError: (error) => {
      toast.error(`Error creating tournament - ${error.message} `);
    },
  });
};
