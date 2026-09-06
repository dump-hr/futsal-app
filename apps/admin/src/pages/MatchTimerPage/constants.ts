import { EventType } from '@futsal-app/types';
import {
  CardRed,
  CardYellow,
  CrossGray,
  GoalLime,
  GoalRed,
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
  EventType.penaltyMiss,
  EventType.yellowCard,
  EventType.redCard,
  EventType.injury,
];

export const SHOOTOUT_EVENTS: EventType[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];

export const EVENT_ICON: Partial<Record<EventType, string>> = {
  [EventType.goal]: GoalLime,
  [EventType.ownGoal]: GoalRed,
  [EventType.penaltyGoal]: GoalLime,
  [EventType.penaltyMiss]: XRed,
  [EventType.yellowCard]: CardYellow,
  [EventType.redCard]: CardRed,
  [EventType.injury]: CrossGray,
  [EventType.shootoutGoal]: TickLime,
  [EventType.shootoutMiss]: XRed,
};
