import type { RefObject } from 'react';
import clsx from 'clsx';
import { MatchDto, MatchType } from '@futsal-app/types';
import { DrawRound } from '@components/DrawRound';
import {
  formatMatchDateShort,
  formatMatchTime,
  getMatchStatus,
  sortMatchesByTime,
} from '@helpers/index';
import { MATCH_STATUS } from '@constants/index';
import c from './Bracket.module.scss';

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

const renderMatch = (match: MatchDto) => {
  const teamA = {
    name: match.homeTeam?.name ?? 'TBD',
    logoUrl: match.homeTeam?.logoUrl,
  };
  const teamB = {
    name: match.awayTeam?.name ?? 'TBD',
    logoUrl: match.awayTeam?.logoUrl,
  };

  const status = getMatchStatus(match);
  if (status === MATCH_STATUS.UPCOMING) {
    return (
      <DrawRound
        status='UPCOMING'
        teamA={teamA}
        teamB={teamB}
        matchDate={formatMatchDateShort(match.timeOfMatch)}
        matchTime={formatMatchTime(match.timeOfMatch)}
      />
    );
  }

  return (
    <DrawRound
      status='ACTIVE'
      teamA={teamA}
      teamB={teamB}
      teamAScore={match.homeGoals}
      teamBScore={match.awayGoals}
    />
  );
};

type BracketProps = {
  rounds: BracketRound[];
  activeRound?: KnockoutRound | null;
  bracketRef?: RefObject<HTMLDivElement | null>;
  onColumnRef?: (round: KnockoutRound, node: HTMLDivElement | null) => void;
};

export const Bracket: React.FC<BracketProps> = ({
  rounds,
  activeRound,
  bracketRef,
  onColumnRef,
}) => {
  return (
    <div className={c.bracket} ref={bracketRef}>
      {rounds.map((round, roundIdx) => {
        const isLastRound = roundIdx === rounds.length - 1;
        const isDim = activeRound != null && round.value !== activeRound;
        return (
          <div
            key={round.value}
            className={clsx(c.column, isDim && c.columnDim)}
            ref={(node) => onColumnRef?.(round.value, node)}>
            {round.matches.map((match, matchIdx) => {
              const isTopOfPair = matchIdx % 2 === 0;
              const hasPairPartner =
                matchIdx % 2 === 1 || matchIdx + 1 < round.matches.length;
              const drawConnector = !isLastRound && hasPairPartner;
              return (
                <div
                  key={match.id}
                  className={clsx(
                    c.matchSlot,
                    drawConnector && (isTopOfPair ? c.pairTop : c.pairBottom),
                  )}>
                  <div className={c.matchInner}>{renderMatch(match)}</div>
                  {drawConnector && (
                    <>
                      <span className={c.lineIn} aria-hidden='true' />
                      <span className={c.lineV} aria-hidden='true' />
                      {isTopOfPair && (
                        <span className={c.lineOut} aria-hidden='true' />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
