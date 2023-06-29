import { Button, Text } from '@components/atoms';
import styles from './Success.module.scss';
import { IconCheck } from '@assets/svg/icons';

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
          A confirmation email has been sent to {email}. Please open it and
          click the button inside to confirm your subscription.
        </Text>
      </div>
      <Button type='button' onClick={() => close(false)} className='button'>
        Dismiss Message
      </Button>
    </div>
  );
};

export default Succcess;
