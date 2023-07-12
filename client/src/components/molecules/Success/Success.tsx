import { IconCheck } from '@assets/svg/icons';
import { Button, Text } from '@components/atoms';
import styles from './Success.module.scss';

type SuccessProps = {
  email: string | null;
  close: (state: boolean) => void;
};

const Succcess = ({ email, close }: SuccessProps) => {
  return (
    <div className={styles.success}>
      <IconCheck className={styles.svg} />
      <div className={styles.message}>
        <Text tag='h1'>Thank for subscribing !</Text>
        <Text tag='p'>
          A confirmation email has been sent to{' '}
          <span className='bold text_accent'>{email}</span>. Please open it and
          click the button inside to confirm your subscription.
        </Text>
      </div>
      <Button
        type='button'
        onClick={() => close(false)}
        className='btn_primary'
      >
        Dismiss Message
      </Button>
    </div>
  );
};

export default Succcess;
