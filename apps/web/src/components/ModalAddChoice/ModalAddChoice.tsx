import clsx from 'clsx';
import { Button } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { PlusBlack, XWhite } from '@assets/icons';
import c from './ModalAddChoice.module.scss';

type ModalAddChoiceProps = {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onCancel: () => void;
};

const ModalAddChoice: React.FC<ModalAddChoiceProps> = ({
  title,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onCancel,
}) => {
  const { overlayRef } = useCloseComponent({ onClose: onCancel });

  return (
    <div
      ref={overlayRef}
      className={clsx(c.overlay, c.overlayAppear)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}>
      <div
        tabIndex={-1}
        role='dialog'
        aria-modal='true'
        className={clsx(c.modal, c.appear)}>
        <div className={c.iconWrapper}>
          <img src={PlusBlack} alt='' className={c.icon} />
        </div>

        <h2 className={c.title}>{title}</h2>

        <div className={c.actions}>
          <Button icon={PlusBlack} variant='primary' onClick={onPrimary}>
            {primaryLabel}
          </Button>
          <Button icon={PlusBlack} variant='primary' onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        </div>

        <Button icon={XWhite} variant='secondary' onClick={onCancel}>
          Odustani
        </Button>
      </div>
    </div>
  );
};

export default ModalAddChoice;
