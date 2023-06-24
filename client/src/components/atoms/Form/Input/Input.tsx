import React, { forwardRef, ForwardedRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef(function Input(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return <input ref={ref} {...props} />;
});

Input.displayName = "Input";

export type { InputProps };
export default Input;
