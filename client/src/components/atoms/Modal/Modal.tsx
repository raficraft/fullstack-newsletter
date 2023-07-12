import { IconCross } from '@assets/svg/icons';
import { InputHTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
      role='dialog'
      aria-modal='true'
      {...rest}
    >
      <button
        className={styles.icon_close}
        title='Close'
        aria-label='Close modal'
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
      >
        <IconCross />
      </button>

      {children}
    </div>,
    document.body
  );
};

export default Modal;
