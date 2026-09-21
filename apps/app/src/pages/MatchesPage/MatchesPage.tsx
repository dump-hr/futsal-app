import { useState } from 'react';
import { Link } from 'wouter';
import {
  Filter,
  MatchCard,
  Skeleton,
  type FilterOption,
} from '@components/index';
import { useMatchGetAll, useMatchTimerLive } from '@api/index';
import { getMatchStatus, groupMatchesByDay } from '@helpers/index';
import { useTournamentId } from '@hooks/index';
import { MATCH_STATUS, type MatchStatus } from '@constants/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import c from './MatchesPage.module.scss';

const statusOptions: FilterOption<MatchStatus>[] = [
  { label: 'Nadolazeće', value: MATCH_STATUS.UPCOMING },
  { label: 'Uživo', value: MATCH_STATUS.LIVE },
  { label: 'Završene', value: MATCH_STATUS.FINISHED },
];

export const MatchesPage = () => {
  const [status, setStatus] = useState<MatchStatus | null | undefined>();
  const [group, setGroup] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const tournamentId = useTournamentId();

  const { data: matches, isLoading, isError } = useMatchGetAll(tournamentId);

  const activeMatch = matches?.find((match) => match.isActive);
  const { elapsedSeconds } = useMatchTimerLive(activeMatch?.id ?? 0);
  const liveElapsedMinutes = Math.floor(elapsedSeconds / 60);

  const names = new Set<string>();
  matches?.forEach((match) => {
    if (match.homeTeam?.group?.name) names.add(match.homeTeam.group.name);
    if (match.awayTeam?.group?.name) names.add(match.awayTeam.group.name);
  });
  const groupOptions: FilterOption<string>[] = [...names]
    .sort()
    .map((name) => ({ label: `${name}`, value: name }));

  const namesById = new Map<number, string>();
  matches?.forEach((match) => {
    if (match.homeTeam) namesById.set(match.homeTeam.id, match.homeTeam.name);
    if (match.awayTeam) namesById.set(match.awayTeam.id, match.awayTeam.name);
  });
  const teamOptions: FilterOption<string>[] = [...namesById.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name]) => ({ label: name, value: String(id) }));

  const hasUnfinished =
    matches?.some((match) => getMatchStatus(match) !== MATCH_STATUS.FINISHED) ??
    false;

  const effectiveStatus =
    status === undefined
      ? hasUnfinished
        ? MATCH_STATUS.UPCOMING
        : null
      : status;

  const dayGroups = groupMatchesByDay(
    matches,
    {
      status: effectiveStatus,
      group,
      teamId: teamId ? Number(teamId) : null,
    },
    hasUnfinished ? 'asc' : 'desc',
  );

  const renderContent = () => {
    if (isLoading)
      return (
        <div className={c.groups}>
          <section className={c.group}>
            <Skeleton width={160} height={24} />
            <div className={c.groupList}>
              <Skeleton count={5} className={c.skeletonCard} />
            </div>
          </section>
        </div>
      );
    if (isError)
      return <p className={c.message}>Greška pri učitavanju utakmica</p>;
    if (dayGroups.length === 0)
      return <p className={c.message}>Nema utakmica</p>;

    return (
      <div className={c.groups}>
        {dayGroups.map((day) => (
          <section key={day.dateKey} className={c.group}>
            <h2 className={c.groupHeader}>{day.dateLabel}</h2>
            <div className={c.groupList}>
              {day.matches.map((match) => (
                <Link
                  key={match.id}
                  href={`${routes.MATCHES}/${match.id}`}
                  className={c.matchLink}>
                  <MatchCard
                    match={match}
                    elapsedMinutes={
                      match.id === activeMatch?.id
                        ? liveElapsedMinutes
                        : undefined
                    }
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <PageLayout title='Utakmice'>
      <div className={c.filters}>
        <Filter
          label='Status'
          value={effectiveStatus}
          options={statusOptions}
          onChange={setStatus}
        />
        <Filter
          label='Skupina'
          value={group}
          options={groupOptions}
          onChange={setGroup}
        />
        <Filter
          label='Tim'
          value={teamId}
          options={teamOptions}
          onChange={setTeamId}
        />
      </div>

      {renderContent()}
    </PageLayout>
  );
};
