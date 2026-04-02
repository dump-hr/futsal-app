import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@components/index';
import ButtonSmall from '@components/ButtonSmall/ButtonSmall';
import Input from '@components/Input/Input';
import { XWhite, CheckBlack, XGray } from '@assets/icons';
import common from './ModalCommon.module.scss';
import c from './PlayerFormModal.module.scss';

type PlayerFormModalProps = {
  firstName?: string;
  lastName?: string;
  onSave: (firstName: string, lastName: string) => void;
  onClose: () => void;
};

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  firstName: initialFirst = '',
  lastName: initialLast = '',
  onSave,
  onClose,
}) => {
  const isEdit = !!(initialFirst || initialLast);
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);

  const handleSave = () => {
    if (!firstName.trim() && !lastName.trim()) {
      toast.error('Unesite ime i prezime igrača');
      return;
    }
    if (!firstName.trim()) {
      toast.error('Unesite ime igrača');
      return;
    }
    if (!lastName.trim()) {
      toast.error('Unesite prezime igrača');
      return;
    }
    onSave(firstName.trim(), lastName.trim());
  };

  return (
    <div
      className={`${common.overlay} ${c.overlay}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className={c.modal} role='dialog' aria-modal='true'>
        <div className={common.header}>
          <div className={common.headerText}>
            <h2 className={common.title}>
              {isEdit ? 'Uredi igrača' : 'Novi igrač'}
            </h2>
            <p className={common.subtitle}>
              {isEdit
                ? 'Uredi ime i prezime igrača'
                : 'Unesi ime i prezime novog igrača'}
            </p>
          </div>
          <ButtonSmall iconSrc={XGray} onClick={onClose} hasBorder />
        </div>

        <div className={c.fields}>
          <div className={c.field}>
            <Input
              label='Ime'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Ime'
            />
          </div>
          <div className={c.field}>
            <Input
              label='Prezime'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Prezime'
            />
          </div>
        </div>

        <div className={common.footer}>
          <Button icon={XWhite} variant='secondary' onClick={onClose}>
            Odustani
          </Button>
          <Button
            icon={CheckBlack}
            variant='primary'
            onClick={handleSave}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerFormModal;
