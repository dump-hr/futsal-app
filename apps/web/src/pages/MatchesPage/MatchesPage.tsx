import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Button,
  FilterDropdown,
  MatchDayGroup,
  MatchFormModal,
  MatchPanel,
  ModalConfirmation,
} from '@components/index';
import { PlayBlack, PlusBlack, TrashCanBlack } from '@assets/icons';
import {
  useMatchGetAll,
  useMatchDelete,
  useMatchSetActive,
} from '@api/match';
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
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    matchId?: number;
  }>({ open: false });
  const [activateConfirm, setActivateConfirm] = useState<{
    open: boolean;
    matchId?: number;
  }>({ open: false });
  const [panelMatchId, setPanelMatchId] = useState<number | undefined>();
  const [panelClosing, setPanelClosing] = useState(false);
  const [, navigate] = useLocation();

  const { data: matches } = useMatchGetAll(TOURNAMENT_ID);
  const { data: teams } = useTeamsGet(TOURNAMENT_ID);
  const { mutate: deleteMatch } = useMatchDelete();
  const { mutate: setMatchActive } = useMatchSetActive();

  const teamOptions: { label: string; value: TeamFilter }[] = [
    { label: 'Ekipa', value: 'all' },
    ...(teams ?? []).map((t) => ({ label: t.name, value: String(t.id) })),
  ];

  const matchGroups = groupMatchesByDay(matches, {
    matchTypeFilter,
    teamFilter,
    dateSort,
  });

  return (
    <div className={c.page}>
      <div className={c.content}>
        <div className={c.header}>
          <h1 className={c.title}>UTAKMICE</h1>
          <Button
            icon={PlusBlack}
            variant='primary'
            onClick={() => setFormModalOpen(true)}>
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
                onEdit={setPanelMatchId}
                onDelete={(matchId) =>
                  setDeleteConfirm({ open: true, matchId })
                }
                onActivate={(matchId) =>
                  setActivateConfirm({ open: true, matchId })
                }
                onTimer={(matchId) =>
                  navigate(`/admin/matches/${matchId}/timer`)
                }
              />
            ))}
          </div>
        )}
      </div>

      {panelMatchId !== undefined && (
        <div
          className={
            panelClosing ? `${c.panelOverlay} ${c.closing}` : c.panelOverlay
          }
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && panelClosing) {
              setPanelMatchId(undefined);
              setPanelClosing(false);
            }
          }}>
          <MatchPanel
            matchId={panelMatchId}
            onClose={() => setPanelClosing(true)}
          />
        </div>
      )}

      {formModalOpen && (
        <MatchFormModal onClose={() => setFormModalOpen(false)} />
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

      {activateConfirm.open && activateConfirm.matchId !== undefined && (
        <ModalConfirmation
          description='Želite li aktivirati utakmicu?'
          boldText='Utakmica će postati aktivna.'
          icon={PlayBlack}
          circleVariant='green'
          onCancel={() => setActivateConfirm({ open: false })}
          onConfirm={() => {
            setMatchActive(activateConfirm.matchId!);
            setActivateConfirm({ open: false });
          }}
        />
      )}
    </div>
  );
};
