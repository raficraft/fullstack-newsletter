import React, { HTMLAttributes } from 'react';
import styles from './Spinner.module.scss';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '', ...rest }) => {
  return (
    <div
      className={`${styles.spinner} ${className}`}
      data-testid='spinner'
      {...rest}
    ></div>
  );
};

export default Spinner;
