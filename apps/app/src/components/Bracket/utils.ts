import { MatchDto, MatchType } from '@futsal-app/types';

export type KnockoutRound = Exclude<
  `${MatchType}`,
  `${MatchType.group}` | `${MatchType.thirdPlace}`
>;

export type BracketRound = {
  value: KnockoutRound;
  label: string;
  matches: MatchDto[];
};

const ROUND_DEFS: { value: KnockoutRound; label: string }[] = [
  { value: MatchType.quarterFinal, label: '1/4' },
  { value: MatchType.semiFinal, label: 'Polufinale' },
  { value: MatchType.final, label: 'Finale' },
];

const sortMatchesByBracketOrder = (matches: MatchDto[]): MatchDto[] =>
  [...matches].sort((a, b) => {
    const aOrder = a.bracketOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.bracketOrder ?? Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) return aOrder - bOrder;

    const timeDiff =
      new Date(a.timeOfMatch).getTime() - new Date(b.timeOfMatch).getTime();

    if (timeDiff !== 0) return timeDiff;

    return a.id - b.id;
  });

export const buildBracketRounds = (
  matches: MatchDto[] | undefined,
): BracketRound[] =>
  ROUND_DEFS.map((def) => ({
    ...def,
    matches: sortMatchesByBracketOrder(
      (matches ?? []).filter((match) => match.matchType === def.value),
    ),
  })).filter((round) => round.matches.length > 0);
