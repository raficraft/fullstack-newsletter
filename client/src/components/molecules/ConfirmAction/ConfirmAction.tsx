import { Button, Text } from '@components/atoms';
import Field from '@molecules/Field/Field';
import { ChangeEvent, useState } from 'react';
import styles from './ConfirmAction.module.scss';

interface ConfirmActionProps {
  confirm: () => void;
  close: () => void;
  constraint: string;
  className?: string;
}

const ConfirmAction = ({
  confirm,
  close,
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
    <form
      className={`box ${styles.dialog} ${className}`}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
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
          data-testid='cancel'
          type='button'
          onClick={close}
          className='btn_primary btn_accent'
        >
          Cancel
        </Button>
        <Button
          data-testid='confirm'
          className='btn_primary'
          type='button'
          onClick={() => {
            confirm();
            close();
          }}
          {...(!constraintValid && { disabled: true })}
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export default ConfirmAction;
