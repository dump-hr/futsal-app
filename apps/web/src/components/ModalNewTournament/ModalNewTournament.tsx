import { useState, useRef, useEffect } from 'react';
import { Button, Input, Modal } from '@components/index';
import { XWhite, CheckBlack } from '@assets/index';
import { useTournamentCreate } from '@api/index';
import c from './ModalNewTournament.module.scss';

type ModalNewTournamentProps = {
  onClose: () => void;
};

export const ModalNewTournament: React.FC<ModalNewTournamentProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const { mutate: createTournament, isPending } = useTournamentCreate();

  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputWrapperRef.current?.querySelector('input')?.focus();
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    createTournament({ name: name.trim() }, { onSuccess: onClose });
  };

  return (
    <Modal
      title='Novi turnir'
      subtitle='Unesi ime novog turnira'
      onClose={onClose}>
      <div className={c.wideInput} ref={inputWrapperRef}>
        <Input
          label='Ime turnira'
          placeholder='Ime'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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
    </Modal>
  );
};
