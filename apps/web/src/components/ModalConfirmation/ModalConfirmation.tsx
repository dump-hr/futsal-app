import clsx from 'clsx';
import { Button } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack } from '@assets/index';
import c from './ModalConfirmation.module.scss';

type CircleVariant = 'green' | 'gray';

type ModalConfirmationProps = {
  description: string;
  boldText: string;
  icon: string;
  circleVariant: CircleVariant;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  description,
  boldText,
  icon,
  circleVariant,
  onCancel,
  onConfirm,
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
        <div className={clsx(c.iconWrapper, c[circleVariant])}>
          <img src={icon} alt='' className={c.icon} />
        </div>

        <div className={c.content}>
          <h2 className={c.title}>Jeste li sigurni?</h2>
          <div className={c.descriptionWrapper}>
            <p className={c.description}>{description}</p>
            <p className={c.boldText}>{boldText}</p>
          </div>
        </div>

        <div className={c.buttons}>
          <Button icon={XWhite} variant='secondary' onClick={onCancel}>
            Odustani
          </Button>
          <Button icon={CheckBlack} variant='primary' onClick={onConfirm}>
            Potvrdi
          </Button>
        </div>
      </div>
    </div>
  );
};
