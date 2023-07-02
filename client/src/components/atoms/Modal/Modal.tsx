import { IconCross } from '@assets/svg/icons';
import { createPortal } from 'react-dom';
import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Modal.module.scss';

interface ModalProps extends InputHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className: string;
  close: () => void;
}

const Modal = ({
  className,
  children,
  close,
  ...rest
}: Partial<ModalProps>) => {
  return createPortal(
    <div
      className={styles.modal}
      onClick={(e) => {
        if (close) {
          e.stopPropagation();
          close();
        }
      }}
      {...rest}
    >
      <span className={styles.icon_close}>
        <IconCross
          onClick={(e) => {
            if (close) {
              e.stopPropagation();
              close();
            }
          }}
        />
      </span>
      <div
        className={`${styles.wrapper} ${className}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
