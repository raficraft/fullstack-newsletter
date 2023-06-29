import { HTMLAttributes } from 'react';
import styles from './Tablet.module.scss';

type TabletProps = HTMLAttributes<HTMLDivElement>;

const Tablet = ({ className, ...rest }: TabletProps) => {
  return (
    <div className={`${styles.tablet} ${className}`} {...rest}>
      <span className={styles.content}>
        <span className={styles.circleTop}></span>
        <span className={styles.circleBottom}></span>
      </span>
    </div>
  );
};

export default Tablet;
