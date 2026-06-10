import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../base';
import { MatchTimerStateDto, MatchTimerSyncDto } from '@futsal-app/types';
import { GENERIC_ERROR_MESSAGE } from '@constants/messages';

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
      if (error.message === 'Greška pri povezivanju s poslužiteljem') return;
      toast.error(error.message || GENERIC_ERROR_MESSAGE);
    },
  });
};
