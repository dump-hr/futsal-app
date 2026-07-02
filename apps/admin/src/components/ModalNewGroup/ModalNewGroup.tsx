import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Input, Modal } from '@components/index';
import { XWhite, CheckBlack } from '@assets/index';
import { useGroupCreate } from '@api/index';
import c from './ModalNewGroup.module.scss';

type ModalNewGroupProps = {
  tournamentId: number;
  existingGroupNames: string[];
  onClose: () => void;
};

export const ModalNewGroup: React.FC<ModalNewGroupProps> = ({
  tournamentId,
  existingGroupNames,
  onClose,
}) => {
  const [name, setName] = useState('');
  const { mutate: createGroup, isPending } = useGroupCreate();

  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputWrapperRef.current?.querySelector('input')?.focus();
  }, []);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || !tournamentId) {
      toast.error('Unesite ime skupine i odaberite turnir');
      return;
    }

    const doesGroupExist = existingGroupNames.some(
      (n) => n.toLowerCase() === trimmed.toLowerCase(),
    );
    if (doesGroupExist) {
      toast.error('Skupina s tim imenom već postoji');
      return;
    }

    createGroup(
      { name: trimmed, tournamentId },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      title='Nova skupina'
      subtitle='Unesi ime nove skupine'
      onClose={onClose}>
      <div className={c.wideInput} ref={inputWrapperRef}>
        <Input
          label='Ime skupine'
          placeholder='Skupina A'
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
          disabled={isPending || !name.trim()}>
          Spremi
        </Button>
      </div>
    </Modal>
  );
};
