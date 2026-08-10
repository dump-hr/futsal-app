import { EventType } from '@futsal-app/types';
import {
  GoalLime,
  OwnGoalRed,
  CardRed,
  CardYellow,
  PenaltyLime,
  XRed,
  CrossGray,
} from '@assets/index';

export type EventCardType =
  | `${EventType.goal}`
  | `${EventType.ownGoal}`
  | `${EventType.redCard}`
  | `${EventType.yellowCard}`
  | `${EventType.penaltyGoal}`
  | `${EventType.penaltyMiss}`
  | `${EventType.injury}`
  | `${EventType.shootoutGoal}`
  | `${EventType.shootoutMiss}`;

export const EVENT_CONFIG: Record<EventCardType, { label: string; icon: string }> = {
  goal: { label: 'GOL', icon: GoalLime },
  ownGoal: { label: 'AUTOGOL', icon: OwnGoalRed },
  redCard: { label: 'CRVENI KARTON', icon: CardRed },
  yellowCard: { label: 'ŽUTI KARTON', icon: CardYellow },
  penaltyGoal: { label: 'PENAL', icon: PenaltyLime },
  penaltyMiss: { label: 'PROMAŠAJ (PENAL)', icon: XRed },
  injury: { label: 'OZLJEDA', icon: CrossGray },
  shootoutGoal: { label: 'GOL', icon: PenaltyLime },
  shootoutMiss: { label: 'PROMAŠAJ', icon: XRed },
};
