import { TeamDto, GroupDto } from '@futsal-app/types';

export const teamWithStatsInclude = {
  group: true,
  players: { select: { id: true } },
  homeMatches: { select: { homeGoals: true, awayGoals: true } },
  awayMatches: { select: { homeGoals: true, awayGoals: true } },
} as const;

type TeamWithStats = {
  id: number;
  name: string;
  logoUrl: string | null;
  groupId: number | null;
  tournamentId: number;
  group?: GroupDto | null;
  players: { id: number }[];
  homeMatches: { homeGoals: number; awayGoals: number }[];
  awayMatches: { homeGoals: number; awayGoals: number }[];
};

export const buildTeamDtoWithStats = (team: TeamWithStats): TeamDto => {
  let score = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const match of team.homeMatches) {
    goalsFor += match.homeGoals;
    goalsAgainst += match.awayGoals;

    if (match.homeGoals > match.awayGoals) score += 3;
    else if (match.homeGoals === match.awayGoals) score += 1;
  }

  for (const match of team.awayMatches) {
    goalsFor += match.awayGoals;
    goalsAgainst += match.homeGoals;

    if (match.awayGoals > match.homeGoals) score += 3;
    else if (match.awayGoals === match.homeGoals) score += 1;
  }

  return {
    id: team.id,
    name: team.name,
    logoUrl: team.logoUrl,
    groupId: team.groupId,
    group: team.group,
    tournamentId: team.tournamentId,
    numberOfPlayers: team.players.length,
    numberOfMatchesPlayed: team.homeMatches.length + team.awayMatches.length,
    teamScore: score,
    goalDifference: goalsFor - goalsAgainst,
  };
};
