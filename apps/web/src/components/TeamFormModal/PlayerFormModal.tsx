import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, ButtonSmall, Input } from '@components/index';
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
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isInvalidName = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length < 2 || trimmed.length > 20;
  };

  const firstNameError = submitAttempted && isInvalidName(firstName);
  const lastNameError = submitAttempted && isInvalidName(lastName);

  const handleSave = () => {
    const fn = firstName.trim();
    const ln = lastName.trim();

    if (!fn || !ln || isInvalidName(fn) || isInvalidName(ln)) {
      setSubmitAttempted(true);

      if (!fn && !ln) {
        toast.error('Unesite ime i prezime igrača');
      } else if (!fn) {
        toast.error('Unesite ime igrača');
      } else if (!ln) {
        toast.error('Unesite prezime igrača');
      } else if (isInvalidName(fn) && isInvalidName(ln)) {
        toast.error('Ime i prezime moraju imati između 2 i 20 znakova');
      } else if (isInvalidName(fn)) {
        toast.error('Ime mora imati između 2 i 20 znakova');
      } else {
        toast.error('Prezime mora imati između 2 i 20 znakova');
      }
      return;
    }

    onSave(fn, ln);
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
              error={firstNameError}
            />
          </div>
          <div className={c.field}>
            <Input
              label='Prezime'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Prezime'
              error={lastNameError}
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
