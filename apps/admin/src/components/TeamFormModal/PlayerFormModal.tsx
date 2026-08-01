import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  ButtonSmall,
  Input,
  ModalConfirmation,
} from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack, XGray, ExitBlack } from '@assets/index';
import {
  isInvalidName,
  getPlayerNameValidationError,
} from '@helpers/validatePlayerName';
import common from './ModalCommon.module.scss';
import c from './PlayerFormModal.module.scss';

type PlayerFormModalProps = {
  firstName?: string;
  lastName?: string;
  onSave: (firstName: string, lastName: string) => void;
  onClose: () => void;
};

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  firstName: initialFirst = '',
  lastName: initialLast = '',
  onSave,
  onClose,
}) => {
  const isEdit = !!(initialFirst || initialLast);
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const firstNameError = submitAttempted && isInvalidName(firstName);
  const lastNameError = submitAttempted && isInvalidName(lastName);

  const isDirty =
    firstName.trim() !== initialFirst.trim() ||
    lastName.trim() !== initialLast.trim();

  const requestClose = useCallback(() => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  useCloseComponent({ onClose: requestClose });

  const handleSave = () => {
    const fn = firstName.trim();
    const ln = lastName.trim();

    const error = getPlayerNameValidationError(fn, ln);
    if (error) {
      setSubmitAttempted(true);
      toast.error(error);
      return;
    }

    onSave(fn, ln);
  };

  return (
    <div
      className={`${common.overlay} ${c.overlay}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
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
          <ButtonSmall iconSrc={XGray} onClick={requestClose} hasBorder />
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
          <Button icon={XWhite} variant='secondary' onClick={requestClose}>
            Odustani
          </Button>
          <Button icon={CheckBlack} variant='primary' onClick={handleSave}>
            Spremi
          </Button>
        </div>
      </div>

      {showCancelConfirm && (
        <ModalConfirmation
          description={
            isEdit
              ? 'Ovim postupkom odbacit ćete sve promjene igrača'
              : 'Ovim postupkom izgubit ćete unesene podatke o igraču'
          }
          boldText={
            isEdit
              ? `${initialFirst} ${initialLast}`.trim() || 'Igrač'
              : 'Novi igrač'
          }
          icon={ExitBlack}
          circleVariant='gray'
          onCancel={() => setShowCancelConfirm(false)}
          onConfirm={onClose}
        />
      )}
    </div>
  );
};
