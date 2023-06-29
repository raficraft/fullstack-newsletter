import { Browser, Tablet, Graphic, Range } from '@components/atoms';
import styles from './Abstract.module.scss';

const Abstract = () => {
  return (
    <div className={styles.abstractContent}>
      <Tablet className={styles.tablet} />
      <Browser className={styles.browser} />
      <Graphic className={styles.graphic} />
      <Range className={styles.range} />
      <div className={styles.combo}></div>
    </div>
  );
};

export default Abstract;
