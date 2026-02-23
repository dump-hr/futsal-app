const GOAL_EVENTS: string[] = ['goal', 'penaltyGoal', 'ownGoal'];

export function isGoalEvent(eventType: string): boolean {
  return GOAL_EVENTS.includes(eventType);
}

export function getScoreChange(
  eventType: string,
  isForHomeTeam: boolean,
): { homeGoals: number; awayGoals: number } {
  const isOwn = eventType === 'ownGoal';
  const scoringHome = isOwn ? !isForHomeTeam : isForHomeTeam;
  return {
    homeGoals: scoringHome ? 1 : 0,
    awayGoals: scoringHome ? 0 : 1,
  };
}
