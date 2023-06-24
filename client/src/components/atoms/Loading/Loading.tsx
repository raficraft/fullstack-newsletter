import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.dotsContainer}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
      <p className="text_m bold letter_spacing_2">Loading...</p>
    </div>
  );
};

export default Loading;
