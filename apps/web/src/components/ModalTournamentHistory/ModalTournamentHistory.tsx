import { Button } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XBlack, CheckBlack, TrashCanGray } from '@assets/icons';
import { useTournamentsGet, useTournamentDelete } from '@api/tournament';
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

  return (
    <div
      ref={overlayRef}
      className={c.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <p className={c.label}>Prošli turniri</p>
      <div tabIndex={-1} role='dialog' aria-modal='true' className={c.modal}>
        <div className={c.header}>
          <div className={c.titleGroup}>
            <h2 className={c.title}>Povijest turnira</h2>
            <p className={c.subtitle}>Pogledaj prošle turnire</p>
          </div>
          <button className={c.closeButton} onClick={onClose}>
            <img src={XBlack} alt='close' />
          </button>
        </div>
        <div className={c.list}>
          {tournaments.map((tournament) => (
            <div key={tournament.id} className={c.listItem}>
              <p className={c.tournamentName}>{tournament.name}</p>
              <button
                className={c.deleteButton}
                onClick={() => deleteTournament(tournament.id)}>
                <img src={TrashCanGray} alt='delete' />
              </button>
            </div>
          ))}
        </div>
        <div className={c.buttons}>
          <Button icon={XBlack} variant='secondary' onClick={onClose}>
            Odustani
          </Button>
          <Button icon={CheckBlack} variant='primary' onClick={onClose}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalTournamentHistory;
