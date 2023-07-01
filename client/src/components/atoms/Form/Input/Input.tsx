import React, {
  forwardRef,
  ForwardedRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
}

const Input = forwardRef(function Input(
  { children, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div style={{ position: 'relative', flexGrow: 1 }}>
      <input ref={ref} {...props} />
      {children}
    </div>
  );
});

Input.displayName = 'Input';

export type { InputProps };
export default Input;
