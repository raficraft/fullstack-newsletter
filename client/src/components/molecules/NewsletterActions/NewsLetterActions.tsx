import { Field } from '@components/molecules';
import { IconCross, IconeDelete, IconeEnabled } from '@assets/svg/icons';
import styles from './NewsLetterActions.module.scss';

interface NewsLetterActionsProps {
  id: string;
  email: string;
  active: boolean;
  handleEditSubscribe: (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleDeletesubscribe: (id: string) => void;
  handleUnsubscribe: (id: string, active: boolean) => void;
  error?: string;
}

export const NewsLetterActions: React.FC<NewsLetterActionsProps> = ({
  id,
  email,
  active,
  handleEditSubscribe,
  handleDeletesubscribe,
  handleUnsubscribe,
  error,
}) => {
  return (
    <Field
      reverse
      type='email'
      className={`bloc_input ${styles.admin_input}`}
      key={`email_${id}`}
      name={`email_${id}`}
      defaultValue={email}
      onChange={(event) => {
        handleEditSubscribe(id, event);
      }}
      error={error}
      {...(!active && { disabled: true })}
    >
      <span className={styles.newsLetterAction}>
        <button
          className={`btn_icon ${active ? 'btn_accent' : 'btn_green'}`}
          type='button'
          title={active ? 'Unsubscribe' : 'Subscribe'}
          onClick={() => {
            handleUnsubscribe(id, !active);
          }}
        >
          {active ? <IconCross /> : <IconeEnabled />}
        </button>
        <span className='hr_vertical'></span>
        <button
          className='btn_icon btn_accent'
          title='Delete'
          type='button'
          onClick={() => {
            handleDeletesubscribe(id);
          }}
        >
          <IconeDelete />
        </button>
      </span>
    </Field>
  );
};

export default NewsLetterActions;
