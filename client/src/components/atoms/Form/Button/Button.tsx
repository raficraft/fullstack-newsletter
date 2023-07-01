import Spinner from '@components/atoms/Spinner/Spinner';
import React from 'react';

type ButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ loading, children, ...rest }) => {
  return (
    <button {...rest} disabled={rest.disabled || loading}>
      {loading ? <Spinner className='spinner' /> : children}
    </button>
  );
};

export default Button;
