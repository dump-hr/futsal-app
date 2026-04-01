import { useState } from 'react';
import { Button, Input } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XBlack, CheckBlack } from '@assets/icons';
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
    createTournament({ name }, { onSuccess: onClose });
  };

  return (
    <div
      ref={overlayRef}
      className={c.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <p className={c.label}>Dodavanje turnira</p>
      <div tabIndex={-1} role='dialog' aria-modal='true' className={c.modal}>
        <button className={c.closeButton} onClick={onClose}>
          <img src={XBlack} alt='close' />
        </button>
        <div className={c.header}>
          <h2 className={c.title}>Novi turnir</h2>
          <p className={c.subtitle}>Unesi ime novog turnira</p>
        </div>
        <Input
          label='Ime turnira'
          placeholder='Ime'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={c.buttons}>
          <Button icon={XBlack} variant='secondary' onClick={onClose}>
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
