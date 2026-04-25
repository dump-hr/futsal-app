import clsx from 'clsx';
import { Button } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack } from '@assets/icons';
import c from './ModalConfirmation.module.scss';

type CircleVariant = 'green' | 'gray';

type ModalConfirmationProps = {
  title?: string;
  description?: string;
  boldText?: string;
  icon: string;
  circleVariant: CircleVariant;
  onCancel: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  title = 'Jeste li sigurni?',
  description,
  boldText,
  icon,
  circleVariant,
  onCancel,
  onConfirm,
  children,
  className,
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
        className={clsx(c.modal, c.appear, className)}>
        <div className={clsx(c.iconWrapper, c[circleVariant])}>
          <img src={icon} alt='' className={c.icon} />
        </div>

        <div className={c.content}>
          <h2 className={c.title}>{title}</h2>
          {(description || boldText) && (
            <div className={c.descriptionWrapper}>
              {description && <p className={c.description}>{description}</p>}
              {boldText && <p className={c.boldText}>{boldText}</p>}
            </div>
          )}
        </div>

        {children}

        {onConfirm && (
          <div className={c.buttons}>
            <Button icon={XWhite} variant='secondary' onClick={onCancel}>
              Odustani
            </Button>
            <Button icon={CheckBlack} variant='primary' onClick={onConfirm}>
              Potvrdi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalConfirmation;
