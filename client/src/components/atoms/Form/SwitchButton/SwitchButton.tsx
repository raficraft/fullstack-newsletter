import React, { ChangeEvent, forwardRef, HTMLProps } from 'react';
import styles from './SwitchButton.module.scss';

type SwitchButtonProps = {
  callback?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: string | React.ReactElement | SVGElement;
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>;

const SwitchButton = forwardRef<HTMLInputElement, SwitchButtonProps>(
  ({ callback, children, ...props }: SwitchButtonProps, ref) => {
    return (
      <div className={`${styles.switchButton}`}>
        <input
          className={styles.checkbox}
          type='checkbox'
          onChange={callback}
          ref={ref}
          {...props}
        />
        {children}
      </div>
    );
  }
);

SwitchButton.displayName = 'SwitchButton';

export default SwitchButton;
