import Button from '../Button/Button';
import { XWhite, CheckBlack } from '@assets/icons';
import styles from './ModalConfirmation.module.scss';

type CircleVariant = 'green' | 'gray';

type ModalConfirmationProps = {
  title: string;
  description: React.ReactNode;
  icon: string;
  circleVariant: CircleVariant;
  onCancel: () => void;
  onConfirm: () => void;
};

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  title,
  description,
  icon,
  circleVariant,
  onCancel,
  onConfirm,
}) => {
  const iconBgClass = circleVariant === 'green' ? 'iconBgGreen' : 'iconBgGray';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.iconWrapper} ${styles[iconBgClass]}`}>
          <img src={icon} alt="" className={styles.icon} />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.description}>{description}</div>
        </div>

        <div className={styles.buttons}>
          <Button icon={XWhite} variant="secondary" onClick={onCancel}>
            Odustani
          </Button>
          <Button icon={CheckBlack} variant="primary" onClick={onConfirm}>
            Potvrdi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;
