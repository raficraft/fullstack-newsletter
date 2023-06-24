import React, { forwardRef, ReactNode, Ref, InputHTMLAttributes } from 'react';
import styles from './Field.module.scss';
import { Input, Text } from '@atoms/index';
import Spinner from '@components/atoms/Spinner/Spinner';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  reverse?: boolean;
  error?: string;
  svg?: ReactNode;
  loading?: boolean;
}

const Field = forwardRef(
  (
    { children, reverse, error, svg, loading = false, ...rest }: FieldProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div className={styles.bloc}>
        <div className={styles.blocInput}>
          {!reverse && children ? children : null}
          <Input ref={ref} {...rest}></Input>
          {svg && !loading ? <span className={styles.icon}>{svg}</span> : null}
          {loading && (
            <span className={styles.icon}>
              <Spinner />
            </span>
          )}
          {reverse && children ? children : null}
        </div>
        <Text className={`text_warning text_s`} role='alert'>
          {error || ''}
        </Text>
      </div>
    );
  }
);

Field.displayName = 'Field';

export default Field;
