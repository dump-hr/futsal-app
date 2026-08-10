import { EventType } from '@futsal-app/types';

export const REGULATION_EVENT_TYPES: EventType[] = [
  EventType.goal,
  EventType.ownGoal,
  EventType.penaltyGoal,
  EventType.penaltyMiss,
  EventType.yellowCard,
  EventType.redCard,
  EventType.injury,
];

export const SHOOTOUT_EVENT_TYPES: EventType[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];
