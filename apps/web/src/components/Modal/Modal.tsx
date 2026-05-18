import { ReactNode } from 'react';
import { useCloseComponent } from '@hooks/useCloseComponent';
import { XWhite } from '@assets/icons';
import { ButtonSmall } from '@components/ButtonSmall';
import c from './Modal.module.scss';

type ModalProps = {
  title: string;
  subtitle: string;
  onClose: () => void;
  width?: number;
  children: ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
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

          <ButtonSmall iconSrc={XWhite} hasBorder onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};
