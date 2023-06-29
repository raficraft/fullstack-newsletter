import { HTMLAttributes } from 'react';
import styles from './Range.module.scss';

type RangeProps = HTMLAttributes<HTMLDivElement>;

const Range = ({ className, ...rest }: RangeProps) => {
  return (
    <div className={`${styles.range} ${className}`} {...rest}>
      <span className={styles.svg}></span>
    </div>
  );
};

export default Range;
