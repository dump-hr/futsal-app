import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { MatchType } from '@futsal-app/types';
import { useMatchGetAll } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { Bracket, buildBracketRounds, type KnockoutRound } from '@components/index';
import { PageLayout } from '@layouts/index';
import c from './DrawPage.module.scss';

const scrollColumnIntoCenter = (container: HTMLElement, node: HTMLElement) => {
  const targetLeft =
    node.offsetLeft - (container.clientWidth - node.clientWidth) / 2;
  container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
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
    return buildBracketRounds(knockoutMatches);
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

        <Bracket
          rounds={rounds}
          activeRound={activeTab}
          bracketRef={bracketRef}
          onColumnRef={(round, node) => {
            columnRefs.current[round] = node;
          }}
        />
      </>
    );
  };

  return <PageLayout title='Ždrijeb'>{renderContent()}</PageLayout>;
};
