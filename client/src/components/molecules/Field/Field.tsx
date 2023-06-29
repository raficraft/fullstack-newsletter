import React, { forwardRef, ReactNode, Ref, InputHTMLAttributes } from 'react';
import styles from './Field.module.scss';
import { Input, Text } from '@atoms/index';
import Spinner from '@components/atoms/Spinner/Spinner';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  reverse: boolean;
  error: string;
  svg: ReactNode;
  loading: boolean;
  errorPosition: 'bottom' | 'label';
}

const Field = forwardRef(
  (
    {
      children,
      reverse,
      error,
      svg,
      loading = false,
      errorPosition = 'bottom',
      ...rest
    }: Partial<FieldProps>,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div className={styles.field}>
        <div className={styles.field_input}>
          {!reverse && children && (
            <span className={styles.label}>
              {children}
              {errorPosition === 'label' && error && (
                <Text className={`text_warning text_xs bold_700`} role='alert'>
                  {error}
                </Text>
              )}
            </span>
          )}
          <Input ref={ref} {...rest}></Input>
          {svg && !loading ? <span className={styles.icon}>{svg}</span> : null}
          {loading && (
            <span className={styles.icon}>
              <Spinner />
            </span>
          )}
          {reverse && children ? children : null}
        </div>

        {errorPosition === 'bottom' ? (
          <Text className={`text_warning text_xs`} role='alert'>
            {error || ''}
          </Text>
        ) : null}
      </div>
    );
  }
);

Field.displayName = 'Field';

export default Field;
