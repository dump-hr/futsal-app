import { EventType } from '@futsal-app/types';

export const REGULATION_EVENT_TYPES: EventType[] = [
  EventType.goal,
  EventType.ownGoal,
  EventType.penaltyGoal,
  EventType.yellowCard,
  EventType.redCard,
];

export const SHOOTOUT_EVENT_TYPES: EventType[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];
