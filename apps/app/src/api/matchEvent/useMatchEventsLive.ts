import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useMatchEventsLive = (matchId: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!matchId) return;

    const source = new EventSource(
      `/api/match-event/match/${matchId}/stream`,
    );

    source.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: ['matchEvents', matchId] });
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
    };

    return () => source.close();
  }, [matchId, queryClient]);
};
