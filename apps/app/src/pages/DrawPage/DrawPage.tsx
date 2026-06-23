import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { MatchType } from '@futsal-app/types';
import { useMatchGetAll } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { DrawRound } from '@components/index';
import { PageLayout } from '@layouts/index';
import c from './DrawPage.module.scss';

type KnockoutRound = Exclude<`${MatchType}`, `${MatchType.group}`>;

const ROUND_TABS: { value: KnockoutRound; label: string }[] = [
  { value: MatchType.quarterFinal, label: '1/4' },
  { value: MatchType.semiFinal, label: 'Polufinale' },
  { value: MatchType.thirdPlace, label: 'Treće mjesto' },
  { value: MatchType.final, label: 'Finale' },
];

export const DrawPage = () => {
  const tournamentId = useTournamentContext();
  const { data: matches, isLoading, isError } = useMatchGetAll(tournamentId);

  const knockoutMatches = useMemo(
    () => matches?.filter((m) => m.matchType !== MatchType.group) ?? [],
    [matches],
  );

  const availableTabs = useMemo(() => {
    const present = new Set(knockoutMatches.map((m) => m.matchType));
    return ROUND_TABS.filter((tab) => present.has(tab.value));
  }, [knockoutMatches]);

  const [selectedRound, setSelectedRound] = useState<KnockoutRound | null>(
    null,
  );
  const activeRound = selectedRound ?? availableTabs[0]?.value ?? null;

  const visibleMatches = activeRound
    ? knockoutMatches.filter((m) => m.matchType === activeRound)
    : [];

  const renderContent = () => {
    if (isLoading) return <p className={c.message}>Učitavanje…</p>;
    if (isError) {
      return <p className={c.message}>Greška pri učitavanju ždrijeba</p>;
    }
    if (knockoutMatches.length === 0) {
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
          {availableTabs.map((tab) => {
            const isActive = tab.value === activeRound;
            return (
              <button
                key={tab.value}
                type='button'
                role='tab'
                aria-selected={isActive}
                className={clsx(c.tab, isActive && c.tabActive)}
                onClick={() => setSelectedRound(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={c.list}>
          {visibleMatches.map((match) => {
            const teamA = {
              name: match.homeTeam?.name ?? 'TBD',
              logoUrl: match.homeTeam?.logoUrl,
            };
            const teamB = {
              name: match.awayTeam?.name ?? 'TBD',
              logoUrl: match.awayTeam?.logoUrl,
            };

            if (match.isActive) {
              return (
                <DrawRound
                  key={match.id}
                  status='ACTIVE'
                  teamA={teamA}
                  teamB={teamB}
                  teamAScore={match.homeGoals}
                  teamBScore={match.awayGoals}
                />
              );
            }

            const date = new Date(match.timeOfMatch);
            return (
              <DrawRound
                key={match.id}
                status='UPCOMING'
                teamA={teamA}
                teamB={teamB}
                matchDate={`${date.getDate()}.${date.getMonth() + 1}.`}
                matchTime={date.toLocaleTimeString('hr', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            );
          })}
        </div>
      </>
    );
  };

  return <PageLayout title='Ždrijeb'>{renderContent()}</PageLayout>;
};
