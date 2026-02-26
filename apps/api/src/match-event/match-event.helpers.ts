import { MatchEventDto } from '@futsal-app/types';

const GOAL_EVENTS: string[] = ['goal', 'penaltyGoal', 'ownGoal'];

export function isGoalEvent(eventType: string): boolean {
  return GOAL_EVENTS.includes(eventType);
}

export function getScoreChange(
  eventType: string,
  isForHomeTeam: boolean,
): { homeGoals: number; awayGoals: number } {
  const homeScored = eventType === 'ownGoal' ? !isForHomeTeam : isForHomeTeam;

  return {
    homeGoals: Number(homeScored),
    awayGoals: Number(!homeScored),
  };
}

export function toMatchEventDto(event: unknown): MatchEventDto {
  return event as MatchEventDto;
}
