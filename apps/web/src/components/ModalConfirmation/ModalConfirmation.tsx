import Button from '../Button/Button';
import { XWhite, CheckBlack } from '@assets/icons';
import c from './ModalConfirmation.module.scss';

type CircleVariant = 'green' | 'gray';

type ModalConfirmationProps = {
  description: string;
  icon: string;
  circleVariant: CircleVariant;
  onCancel: () => void;
  onConfirm: () => void;
};

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  description,
  icon,
  circleVariant,
  onCancel,
  onConfirm,
}) => {
  const iconBgClass = circleVariant === 'green' ? 'iconBgGreen' : 'iconBgGray';

  return (
    <div className={c.overlay}>
      <div className={c.modal}>
        <div className={`${c.iconWrapper} ${c[iconBgClass]}`}>
          <img src={icon} alt='' className={c.icon} />
        </div>

        <div className={c.content}>
          <h2 className={c.title}>Jeste li sigurni?</h2>
          <p className={c.description}>{description}</p>
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
