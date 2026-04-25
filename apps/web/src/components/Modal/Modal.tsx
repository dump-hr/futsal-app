import { ReactNode } from 'react';
import { useCloseComponent } from '@hooks/index';
import { XWhite } from '@assets/icons';
import c from './Modal.module.scss';

type ModalProps = {
  title: string;
  subtitle: string;
  onClose: () => void;
  width?: number;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  onClose,
  width,
  children,
}) => {
  const { overlayRef } = useCloseComponent({ onClose });

  return (
    <div
      ref={overlayRef}
      className={c.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        tabIndex={-1}
        role='dialog'
        aria-modal='true'
        className={c.modal}
        style={width ? { width } : undefined}>
        <div className={c.header}>
          <div className={c.titleGroup}>
            <h2 className={c.title}>{title}</h2>
            <p className={c.subtitle}>{subtitle}</p>
          </div>

          <button className={c.closeButton} onClick={onClose}>
            <img src={XWhite} alt='close' />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
