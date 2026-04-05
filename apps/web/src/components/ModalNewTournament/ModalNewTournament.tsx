import { useState } from 'react';
import { Button, Input } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack } from '@assets/icons';
import { useTournamentCreate } from '@api/tournament';
import c from './ModalNewTournament.module.scss';

type ModalNewTournamentProps = {
  onClose: () => void;
};

const ModalNewTournament: React.FC<ModalNewTournamentProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const { mutate: createTournament, isPending } = useTournamentCreate();
  const { overlayRef } = useCloseComponent({ onClose });

  const handleSave = () => {
    if (!name.trim()) return;
    createTournament(
      { name, date: new Date().toString() },
      { onSuccess: onClose },
    );
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
            <h2 className={c.title}>Novi turnir</h2>
            <p className={c.subtitle}>Unesi ime novog turnira</p>
          </div>
          <button className={c.closeButton} onClick={onClose}>
            <img src={XWhite} alt='close' />
          </button>
        </div>
        <div className={c.wideInput}>
          <Input
            label='Ime turnira'
            placeholder='Ime'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={c.buttons}>
          <Button icon={XWhite} variant='secondary' onClick={onClose}>
            Odustani
          </Button>
          <Button
            icon={CheckBlack}
            variant='primary'
            onClick={handleSave}
            disabled={isPending}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalNewTournament;
