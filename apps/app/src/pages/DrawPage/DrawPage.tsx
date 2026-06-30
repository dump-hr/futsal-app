import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { MatchDto, MatchType } from '@futsal-app/types';
import { useMatchGetAll } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { DrawRound } from '@components/index';
import { PageLayout } from '@layouts/index';
import {
  formatMatchDateShort,
  formatMatchTime,
  getMatchStatus,
  sortMatchesByTime,
} from '@helpers/index';
import { MATCH_STATUS } from '@constants/index';
import c from './DrawPage.module.scss';

type KnockoutRound = Exclude<
  `${MatchType}`,
  `${MatchType.group}` | `${MatchType.thirdPlace}`
>;

const ROUND_DEFS: { value: KnockoutRound; label: string }[] = [
  { value: MatchType.quarterFinal, label: '1/4' },
  { value: MatchType.semiFinal, label: 'Polufinale' },
  { value: MatchType.final, label: 'Finale' },
];

const scrollColumnIntoCenter = (container: HTMLElement, node: HTMLElement) => {
  const targetLeft =
    node.offsetLeft - (container.clientWidth - node.clientWidth) / 2;
  container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
};

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

export const DrawPage = () => {
  const [activeRound, setActiveRound] = useState<KnockoutRound | null>(null);
  const tournamentId = useTournamentContext();
  const bracketRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { data: matches, isLoading, isError } = useMatchGetAll(tournamentId);

  const knockoutMatches = (matches ?? []).filter(
    (m) => m.matchType !== MatchType.group,
  );

  const rounds = useMemo(() => {
    return ROUND_DEFS.map((def) => ({
      ...def,
      matches: sortMatchesByTime(
        knockoutMatches.filter((m) => m.matchType === def.value),
      ),
    })).filter((round) => round.matches.length > 0);
  }, [knockoutMatches]);

  const activeTab = activeRound ?? rounds[0]?.value ?? null;

  useEffect(() => {
    if (!activeRound && rounds[0]) {
      setActiveRound(rounds[0].value);
    }
  }, [rounds, activeRound]);

  const handleTabClick = (round: KnockoutRound) => {
    setActiveRound(round);

    const node = columnRefs.current[round];
    const container = bracketRef.current;

    if (node && container) scrollColumnIntoCenter(container, node);
  };

  const renderContent = () => {
    if (isLoading) return <p className={c.message}>Učitavanje…</p>;
    if (isError) {
      return <p className={c.message}>Greška pri učitavanju ždrijeba</p>;
    }

    if (rounds.length === 0) {
      return (
        <p className={c.message}>
          Ždrijeb još nije održan. Trenutno se igraju samo utakmice po
          skupinama.
        </p>
      );
    }

    return (
      <>
        <div className={c.tabs} role='tablist'>
          {rounds.map((round) => {
            const isActive = round.value === activeTab;
            return (
              <button
                key={round.value}
                type='button'
                role='tab'
                aria-selected={isActive}
                className={clsx(c.tab, isActive && c.tabActive)}
                onClick={() => handleTabClick(round.value)}>
                {round.label}
              </button>
            );
          })}
        </div>

        <div className={c.bracket} ref={bracketRef}>
          {rounds.map((round, roundIdx) => {
            const isLastRound = roundIdx === rounds.length - 1;
            const isActiveCol = round.value === activeTab;
            return (
              <Fragment key={round.value}>
                <div
                  className={clsx(c.column, !isActiveCol && c.columnDim)}
                  ref={(node) => {
                    columnRefs.current[round.value] = node;
                  }}>
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
                          drawConnector &&
                            (isTopOfPair ? c.pairTop : c.pairBottom),
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
              </Fragment>
            );
          })}
        </div>
      </>
    );
  };

  return <PageLayout title='Ždrijeb'>{renderContent()}</PageLayout>;
};
