import { HTMLAttributes } from 'react';
import styles from './Graphic.module.scss';

type GraphicProps = HTMLAttributes<HTMLDivElement>;

const Graphic = ({ className, ...rest }: GraphicProps) => {
  return (
    <div className={`${styles.graphic} ${className}`} {...rest}>
      <span className={styles.svg}></span>
    </div>
  );
};

export default Graphic;
