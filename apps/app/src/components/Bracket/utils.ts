import { MatchDto, MatchType } from '@futsal-app/types';
import { sortMatchesByTime } from '@helpers/index';

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

export const buildBracketRounds = (
  matches: MatchDto[] | undefined,
): BracketRound[] =>
  ROUND_DEFS.map((def) => ({
    ...def,
    matches: sortMatchesByTime(
      (matches ?? []).filter((match) => match.matchType === def.value),
    ),
  })).filter((round) => round.matches.length > 0);
