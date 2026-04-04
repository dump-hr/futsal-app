import { useState, useMemo } from 'react';
import { Button, FilterDropdown, MatchDayGroup, MatchFormModal, ModalConfirmation } from '@components/index';
import { PlusBlack, TrashCanGray } from '@assets/icons';
import { useMatchGetAll, useMatchDelete } from '@api/match';
import { getDateKey, formatMatchDayHeader } from '@helpers/matchHelpers';
import c from './MatchesPage.module.scss';
import {
  type MatchTypeFilter,
  type DateSort,
  type TeamFilter,
  MATCH_TYPE_OPTIONS,
  DATE_SORT_OPTIONS,
} from './options';

// TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

export const MatchesPage = () => {
  const { data: matches } = useMatchGetAll(TOURNAMENT_ID);

  const [matchTypeFilter, setMatchTypeFilter] = useState<MatchTypeFilter>('all');
  const [dateSort, setDateSort] = useState<DateSort>('asc');
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all');
  const [formModal, setFormModal] = useState<{ open: boolean; matchId?: number }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; matchId?: number }>({ open: false });
  const { mutate: deleteMatch } = useMatchDelete();

  const teamOptions = useMemo(() => {
    const opts: { label: string; value: TeamFilter }[] = [
      { label: 'Ekipa', value: 'all' },
    ];
    if (!matches) return opts;

    const seen = new Set<number>();
    for (const match of matches) {
      if (match.homeTeam && !seen.has(match.homeTeam.id)) {
        seen.add(match.homeTeam.id);
        opts.push({
          label: match.homeTeam.name,
          value: String(match.homeTeam.id),
        });
      }
      if (match.awayTeam && !seen.has(match.awayTeam.id)) {
        seen.add(match.awayTeam.id);
        opts.push({
          label: match.awayTeam.name,
          value: String(match.awayTeam.id),
        });
      }
    }
    return opts;
  }, [matches]);

  const matchGroups = useMemo(() => {
    if (!matches) return [];

    let result = [...matches];

    if (matchTypeFilter !== 'all') {
      result = result.filter((m) => m.matchType === matchTypeFilter);
    }

    if (teamFilter !== 'all') {
      result = result.filter(
        (m) =>
          String(m.homeTeam?.id) === teamFilter ||
          String(m.awayTeam?.id) === teamFilter,
      );
    }

    result.sort((a, b) => {
      const diff =
        new Date(a.timeOfMatch).getTime() - new Date(b.timeOfMatch).getTime();
      return dateSort === 'desc' ? -diff : diff;
    });

    const groups = new Map<
      string,
      { dateLabel: string; matches: typeof result }
    >();

    for (const match of result) {
      const date = new Date(match.timeOfMatch);
      const key = getDateKey(date);
      if (!groups.has(key)) {
        groups.set(key, { dateLabel: formatMatchDayHeader(date), matches: [] });
      }
      groups.get(key)!.matches.push(match);
    }

    return Array.from(groups.entries()).map(([dateKey, { dateLabel, matches }]) => ({
      dateKey,
      dateLabel,
      matches,
    }));
  }, [matches, matchTypeFilter, dateSort, teamFilter]);

  return (
    <div className={c.page}>
      <div className={c.header}>
        <h1 className={c.title}>UTAKMICE</h1>
        <Button icon={PlusBlack} variant='primary' onClick={() => setFormModal({ open: true })}>
          Nova utakmica
        </Button>
      </div>

      <div className={c.filters}>
        <span className={c.filterLabel}>Filtriraj</span>
        <div className={c.filterDropdowns}>
          <FilterDropdown
            value={matchTypeFilter}
            options={MATCH_TYPE_OPTIONS}
            onChange={setMatchTypeFilter}
          />
          <FilterDropdown
            value={dateSort}
            options={DATE_SORT_OPTIONS}
            onChange={setDateSort}
          />
          <FilterDropdown
            value={teamFilter}
            options={teamOptions}
            onChange={setTeamFilter}
          />
        </div>
      </div>

      {matchGroups.length === 0 ? (
        <div className={c.empty}>Nema dodanih utakmica!</div>
      ) : (
        <div className={c.matchGroups}>
          {matchGroups.map(({ dateKey, dateLabel, matches }) => (
            <MatchDayGroup
              key={dateKey}
              dateLabel={dateLabel}
              matches={matches}
              onEdit={(matchId) => setFormModal({ open: true, matchId })}
              onDelete={(matchId) => setDeleteConfirm({ open: true, matchId })}
            />
          ))}
        </div>
      )}

      {formModal.open && (
        <MatchFormModal
          matchId={formModal.matchId}
          onClose={() => setFormModal({ open: false })}
        />
      )}

      {deleteConfirm.open && deleteConfirm.matchId !== undefined && (
        <ModalConfirmation
          description='Jeste li sigurni da želite obrisati utakmicu?'
          boldText='Ova radnja se ne može poništiti.'
          icon={TrashCanGray}
          circleVariant='gray'
          onCancel={() => setDeleteConfirm({ open: false })}
          onConfirm={() => {
            deleteMatch(deleteConfirm.matchId!);
            setDeleteConfirm({ open: false });
          }}
        />
      )}
    </div>
  );
};
