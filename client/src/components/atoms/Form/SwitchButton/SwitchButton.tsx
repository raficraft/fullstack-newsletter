import React, { ChangeEvent, forwardRef, HTMLProps } from "react";
import internalStyles from "./SwitchButton.module.scss";

type SwitchButtonProps = {
  callback: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: string | React.ReactElement | SVGElement;
  externalStyles?: any;
} & Omit<HTMLProps<HTMLInputElement>, "ref">;

const SwitchButton = forwardRef<HTMLInputElement, SwitchButtonProps>(
  (
    { callback, externalStyles, children, ...props }: SwitchButtonProps,
    ref
  ) => {
    const styles = externalStyles || internalStyles;

    return (
      <div className={`${styles.switchButton}`}>
        <input
          className={styles.checkbox}
          id="switchTheme"
          name="switchTheme"
          type="checkbox"
          onChange={callback}
          ref={ref}
          {...props}
        />
        {children}
      </div>
    );
  }
);

SwitchButton.displayName = "SwitchButton";

export default SwitchButton;
