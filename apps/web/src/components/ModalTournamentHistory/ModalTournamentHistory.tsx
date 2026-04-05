import { useState } from 'react';
import { Button } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { CheckBlack, CrossGray, TrashCanWhite, XWhite } from '@assets/icons';
import { useTournamentsGet, useTournamentDelete } from '@api/tournament';
import clsx from 'clsx';
import c from './ModalTournamentHistory.module.scss';

type ModalTournamentHistoryProps = {
  onClose: () => void;
};

const ModalTournamentHistory: React.FC<ModalTournamentHistoryProps> = ({
  onClose,
}) => {
  const { data: tournaments = [] } = useTournamentsGet();
  const { mutate: deleteTournament } = useTournamentDelete();
  const { overlayRef } = useCloseComponent({ onClose });
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<number>>(new Set());

  const toggleMark = (id: number) => {
    setMarkedForDeletion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    markedForDeletion.forEach((id) => deleteTournament(id));
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className={c.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div tabIndex={-1} role='dialog' aria-modal='true' className={c.modal}>
        <div className={c.header}>
          <div className={c.titleGroup}>
            <h2 className={c.title}>Povijest turnira</h2>
            <p className={c.subtitle}>Pogledaj prošle turnire</p>
          </div>
          <button className={c.closeButton} onClick={onClose}>
            <img src={XWhite} alt='close' />
          </button>
        </div>
        <div className={c.list}>
          {tournaments.map((tournament) => {
            const isMarked = markedForDeletion.has(tournament.id);
            return (
              <div key={tournament.id} className={clsx(c.listItem, isMarked && c.listItemMarked)}>
                <p className={clsx(c.tournamentName, isMarked && c.tournamentNameMarked)}>
                  {tournament.name}
                </p>
                <button
                  className={clsx(c.deleteButton, isMarked && c.deleteButtonActive)}
                  onClick={() => toggleMark(tournament.id)}
                  title={isMarked ? 'Poništi brisanje' : 'Označi za brisanje'}>
                  <img src={isMarked ? CrossGray : TrashCanWhite} alt={isMarked ? 'undo' : 'delete'} />
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
      </div>
    </div>
  );
};

export default ModalTournamentHistory;
