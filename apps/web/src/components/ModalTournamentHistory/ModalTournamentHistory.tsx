import { useState } from 'react';
import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { CheckBlack, CrossGray, TrashCanWhite, XWhite } from '@assets/icons';
import { useTournamentsGet, useTournamentDelete } from '@api/tournament';
import clsx from 'clsx';
import c from './ModalTournamentHistory.module.scss';

type ModalTournamentHistoryProps = {
  onClose: () => void;
};

export const ModalTournamentHistory: React.FC<ModalTournamentHistoryProps> = ({
  onClose,
}) => {
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<number>>(
    new Set(),
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

          return (
            <div
              key={tournament.id}
              className={clsx(c.listItem, isMarked && c.listItemMarked)}>
              <p
                className={clsx(
                  c.tournamentName,
                  isMarked && c.tournamentNameMarked,
                )}>
                {tournament.name}
              </p>

              <button
                className={clsx(
                  c.deleteButton,
                  isMarked && c.deleteButtonActive,
                )}
                onClick={() => toggleMark(tournament.id)}
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
