import type { RefObject } from 'react';
import clsx from 'clsx';
import { Link } from 'wouter';
import { MatchDto } from '@futsal-app/types';
import { DrawRound } from '@components/DrawRound';
import {
  formatMatchDateShort,
  formatMatchTime,
  getMatchStatus,
} from '@helpers/index';
import { MATCH_STATUS } from '@constants/index';
import { routes } from '@routes/index';
import type { BracketRound, KnockoutRound } from './utils';
import c from './Bracket.module.scss';

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
  const round =
    status === MATCH_STATUS.UPCOMING ? (
      <DrawRound
        status='UPCOMING'
        teamA={teamA}
        teamB={teamB}
        matchDate={formatMatchDateShort(match.timeOfMatch)}
        matchTime={formatMatchTime(match.timeOfMatch)}
      />
    ) : (
      <DrawRound
        status='ACTIVE'
        teamA={teamA}
        teamB={teamB}
        teamAScore={match.homeGoals}
        teamBScore={match.awayGoals}
      />
    );

  return (
    <Link href={`${routes.MATCHES}/${match.id}`} className={c.matchLink}>
      {round}
    </Link>
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
