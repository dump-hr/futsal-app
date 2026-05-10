import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchTimerStateDto, MatchTimerSyncDto } from '@futsal-app/types';

const matchTimerSync = (matchId: number, dto: MatchTimerSyncDto) => {
  return api.patch<MatchTimerSyncDto, MatchTimerStateDto>(
    `/match/${matchId}/timer`,
    dto,
  );
};

export const useMatchTimerSync = (matchId: number) => {
  return useMutation({
    mutationFn: (dto: MatchTimerSyncDto) => matchTimerSync(matchId, dto),
    onError: (error) => {
      if (error.message === 'Network error') return;
      toast.error(`Greška pri sinkronizaciji tajmera - ${error.message}`);
    },
  });
};
