import { useContext, useState } from 'react';
import { Button, Modal } from '@components/index';
import {
  CheckBlack,
  CrossGray,
  TickLime,
  TrashCanWhite,
  XWhite,
} from '@assets/index';
import { useTournamentsGet, useTournamentDelete } from '@api/index';
import { TournamentContext } from '@context/index';
import clsx from 'clsx';
import c from './ModalTournamentHistory.module.scss';

type ModalTournamentHistoryProps = {
  onClose: () => void;
};

export const ModalTournamentHistory: React.FC<ModalTournamentHistoryProps> = ({
  onClose,
}) => {
  const { tournamentId: activeTournamentId, selectTournament } = useContext(
    TournamentContext,
  ) ?? { tournamentId: null, selectTournament: () => {} };

  const [markedForDeletion, setMarkedForDeletion] = useState<Set<number>>(
    new Set(),
  );
  const [pendingSelectedId, setPendingSelectedId] = useState<number | null>(
    activeTournamentId,
  );

  const { data: tournaments = [] } = useTournamentsGet();
  const { mutateAsync: deleteTournament } = useTournamentDelete();

  const toggleMark = (id: number) => {
    setMarkedForDeletion((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const handleSave = async () => {
    await Promise.allSettled(
      [...markedForDeletion].map((id) => deleteTournament(id)),
    );

    if (pendingSelectedId != null && !markedForDeletion.has(pendingSelectedId)) {
      selectTournament(pendingSelectedId);
    }

    onClose();
  };

  return (
    <Modal
      title='Povijest turnira'
      subtitle='Pogledaj prošle turnire'
      onClose={onClose}
      width={620}>
      <div className={c.list}>
        {tournaments.map((tournament) => {
          const isMarked = markedForDeletion.has(tournament.id);
          const isSelected = !isMarked && pendingSelectedId === tournament.id;

          return (
            <div
              key={tournament.id}
              className={clsx(
                c.listItem,
                isSelected && c.listItemSelected,
                isMarked && c.listItemMarked,
              )}
              role='button'
              tabIndex={0}
              onClick={() => !isMarked && setPendingSelectedId(tournament.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isMarked) {
                  e.preventDefault();
                  setPendingSelectedId(tournament.id);
                }
              }}>
              <div className={c.tournamentInfo}>
                {isSelected && (
                  <img className={c.selectedIcon} src={TickLime} alt='' />
                )}
                <p
                  className={clsx(
                    c.tournamentName,
                    isMarked && c.tournamentNameMarked,
                  )}>
                  {tournament.name}
                </p>
              </div>

              <button
                className={clsx(
                  c.deleteButton,
                  isMarked && c.deleteButtonActive,
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMark(tournament.id);
                }}
                title={isMarked ? 'Poništi brisanje' : 'Označi za brisanje'}>
                <img
                  src={isMarked ? CrossGray : TrashCanWhite}
                  alt={isMarked ? 'undo' : 'delete'}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className={c.buttons}>
        <Button icon={XWhite} variant='secondary' onClick={onClose}>
          Odustani
        </Button>
        <Button icon={CheckBlack} variant='primary' onClick={handleSave}>
          Spremi
        </Button>
      </div>
    </Modal>
  );
};
