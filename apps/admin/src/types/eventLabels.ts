import { EventType } from '@futsal-app/types';

export const EVENT_LABELS: Record<EventType, string> = {
  [EventType.goal]: 'Gol',
  [EventType.ownGoal]: 'Autogol',
  [EventType.penaltyGoal]: 'Gol (penal)',
  [EventType.penaltyMiss]: 'Promašaj (penal)',
  [EventType.yellowCard]: 'Žuti karton',
  [EventType.redCard]: 'Crveni karton',
  [EventType.injury]: 'Ozljeda',
  [EventType.shootoutGoal]: 'Gol (penali)',
  [EventType.shootoutMiss]: 'Promašaj (penali)',
};
