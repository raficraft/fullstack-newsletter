import { Browser, Tablet, Graphic, Range } from '@components/atoms';
import styles from './Abstract.module.scss';

const Abstract = () => {
  return (
    <div className={styles.abstractContent} data-testid='abstract'>
      <Tablet className={styles.tablet} data-testid='tablet' />
      <Browser className={styles.browser} data-testid='browser' />
      <Graphic className={styles.graphic} data-testid='graphic' />
      <Range className={styles.range} data-testid='range' />
      <div className={styles.combo} data-testid='combo'></div>
    </div>
  );
};

export default Abstract;
