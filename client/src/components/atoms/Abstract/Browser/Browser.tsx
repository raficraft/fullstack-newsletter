import { HTMLAttributes } from 'react';
import styles from './Browser.module.scss';

type BrowserProps = HTMLAttributes<HTMLDivElement>;

const Browser = ({ className, ...rest }: BrowserProps) => {
  return (
    <div className={`${styles.browser} ${className}`} {...rest}>
      <div className={styles.header}>
        <span className={styles.dotContainer}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </span>
      </div>
      <div className={styles.browser_content}>
        <span className={styles.content_aside}>
          <ul className={styles.fakeList}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </span>
        <span className={styles.content_main}></span>
      </div>
      T
    </div>
  );
};

export default Browser;
