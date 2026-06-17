import { EventType } from '@futsal-app/types';

export type MatchEventSaveData = {
  minute: number;
  playerName: string;
  playerId?: number;
  eventType: `${EventType}`;
};
