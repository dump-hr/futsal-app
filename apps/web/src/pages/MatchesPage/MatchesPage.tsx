import { useState, useMemo } from 'react';
import {
  Button,
  FilterDropdown,
  MatchDayGroup,
  MatchFormModal,
  ModalConfirmation,
} from '@components/index';
import { PlusBlack, TrashCanBlack } from '@assets/icons';
import { useMatchGetAll, useMatchDelete } from '@api/match';
import { useTeamsGet } from '@api/team';
import { groupMatchesByDay } from '@helpers/matchHelpers';
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
  const [matchTypeFilter, setMatchTypeFilter] =
    useState<MatchTypeFilter>('all');
  const [dateSort, setDateSort] = useState<DateSort>('asc');
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all');
  const [formModal, setFormModal] = useState<{
    open: boolean;
    matchId?: number;
  }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    matchId?: number;
  }>({ open: false });

  const { data: matches } = useMatchGetAll(TOURNAMENT_ID);
  const { data: teams } = useTeamsGet(TOURNAMENT_ID);
  const { mutate: deleteMatch } = useMatchDelete();

  const teamOptions = useMemo<{ label: string; value: TeamFilter }[]>(
    () => [
      { label: 'Ekipa', value: 'all' },
      ...(teams ?? []).map((t) => ({ label: t.name, value: String(t.id) })),
    ],
    [teams],
  );

  const matchGroups = useMemo(
    () => groupMatchesByDay(matches, { matchTypeFilter, teamFilter, dateSort }),
    [matches, matchTypeFilter, teamFilter, dateSort],
  );

  return (
    <div className={c.page}>
      <div className={c.header}>
        <h1 className={c.title}>UTAKMICE</h1>
        <Button
          icon={PlusBlack}
          variant='primary'
          onClick={() => setFormModal({ open: true })}>
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
        <div className={c.empty}>
          {matches && matches.length > 0
            ? 'Nema utakmica koje odgovaraju filtrima'
            : 'Nema dodanih utakmica!'}
        </div>
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
          icon={TrashCanBlack}
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
