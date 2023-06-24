import { Text } from "@atoms/index";
import styles from "./ErrorApi.module.scss";
import Image from "next/image";

function ErrorApi() {
  return (
    <div className={styles.errorApi}>
      <Image src="/smiley2.png" width="60" height="60" alt="oups" />
      <div>
        <Text tag="p" className="bold text_m text_center">
          No Definitions Found
        </Text>
        <Text tag="p" className="text_s text_gray text_center">
          {`Sorry pal, we couldn't find definitions for the word you were looking
        for. You can try the search again at later time or head to the web
        instead.`}
        </Text>
      </div>
    </div>
  );
}

export default ErrorApi;
