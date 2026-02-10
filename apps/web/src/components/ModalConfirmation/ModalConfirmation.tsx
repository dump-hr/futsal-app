import clsx from 'clsx';
import Button from '../Button/Button';
import { XWhite, CheckBlack } from '@assets/icons';
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

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  description,
  boldText,
  icon,
  circleVariant,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className={c.overlay}>
      <div className={c.modal}>
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

export default ModalConfirmation;
