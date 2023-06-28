import styles from './Abstract.module.scss';

const Abstract = () => {
  return (
    <div className={styles.abstractContent}>
      <div className={styles.screenLeft}>
        <span className={styles.screenLeft_inside}>
          <span className={styles.circleTop}></span>
          <span className={styles.circleBottom}></span>
        </span>
      </div>

      <div className={styles.screenRight}>
        <div className={styles.screenRight_header}>
          <span className={styles.dotContainer}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </span>
        </div>
        <div className={styles.screenRight_content}>
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
      </div>

      <span className={styles.diagram}>
        <span className={styles.diagram_svg}></span>
      </span>
      <div className={styles.score}>
        <span className={styles.score_svg}></span>
      </div>
    </div>
  );
};

export default Abstract;
