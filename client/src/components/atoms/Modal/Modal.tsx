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
      data-testid='backdrop'
      className={styles.modal}
      onClick={(e) => {
        close();
      }}
      {...rest}
    >
      <span
        className={styles.icon_close}
        title='Close modal'
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
      >
        <IconCross />
      </span>

      {children}
    </div>,
    document.body
  );
};

export default Modal;
