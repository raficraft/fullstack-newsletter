import { IconCross } from '@assets/svg/icons';
import { createPortal } from 'react-dom';
import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Modal.module.scss';

interface ModalProps extends InputHTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  close: () => void;
}

const Modal = ({ className, children, close, ...rest }: ModalProps) => {
  return createPortal(
    <div
      className={styles.modal}
      onClick={(e) => {
        close();
      }}
      {...rest}
    >
      <span className={styles.icon_close}>
        <IconCross
          data-testid='close_modal'
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        />
      </span>
      <div data-testid='backdrop' className={`${styles.wrapper} ${className}`}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
