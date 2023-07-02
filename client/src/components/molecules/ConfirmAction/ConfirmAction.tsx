import { Button, Input, Text } from '@components/atoms';
import { ChangeEvent, useState } from 'react';
import Field from '../Field/Field';
import styles from './ConfirmAction.module.scss';

interface ConfirmActionProps {
  confirm: () => void;
  cancel: () => void;
  constraint: string;
  className?: string;
}

const ConfirmAction = ({
  confirm,
  cancel,
  constraint,
  className = '',
}: ConfirmActionProps) => {
  const [constraintValid, setConstraintValid] = useState<boolean>(false);

  const validation = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === constraint) {
      setConstraintValid(true);
    }
  };

  return (
    <div className={`box ${styles.dialog} ${className}`}>
      <div className={styles.content}>
        <Text tag='p'>
          To confirm your action please enter{' '}
          <span className='text_accent bold'>{constraint}</span> in the fields
          below
        </Text>

        <Field
          onChange={validation}
          className='bloc_input'
          placeholder='Enter the text in red'
        />
      </div>
      <footer>
        <Button
          type='button'
          onClick={cancel}
          className='btn_primary btn_accent'
        >
          Annuler
        </Button>
        <Button
          className='btn_primary'
          type='button'
          onClick={() => {
            confirm();
            cancel();
          }}
          {...(!constraintValid && { disabled: true })}
        >
          Confirm
        </Button>
      </footer>
    </div>
  );
};

export default ConfirmAction;
