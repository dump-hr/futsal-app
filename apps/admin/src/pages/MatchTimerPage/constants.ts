import { EventType } from '@futsal-app/types';
import {
  CardRed,
  CardYellow,
  GoalLime,
  TickLime,
  XRed,
} from '@assets/index';

export const REGULATION_HOTKEYS: Record<string, EventType> = {
  g: EventType.goal,
  a: EventType.ownGoal,
  c: EventType.redCard,
  z: EventType.yellowCard,
  p: EventType.penaltyGoal,
};

export const SHOOTOUT_HOTKEYS: Record<string, EventType> = {
  g: EventType.shootoutGoal,
  p: EventType.shootoutMiss,
};

export const REGULATION_EVENTS: EventType[] = [
  EventType.goal,
  EventType.ownGoal,
  EventType.penaltyGoal,
  EventType.yellowCard,
  EventType.redCard,
];

export const SHOOTOUT_EVENTS: EventType[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];

export const EVENT_ICON: Partial<Record<EventType, string>> = {
  [EventType.goal]: GoalLime,
  [EventType.ownGoal]: GoalLime,
  [EventType.penaltyGoal]: GoalLime,
  [EventType.yellowCard]: CardYellow,
  [EventType.redCard]: CardRed,
  [EventType.shootoutGoal]: TickLime,
  [EventType.shootoutMiss]: XRed,
};
