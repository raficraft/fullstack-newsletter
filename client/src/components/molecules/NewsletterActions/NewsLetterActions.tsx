import { ConfirmAction, Field } from '@components/molecules';
import { IconCross, IconeDelete, IconeEnabled } from '@assets/svg/icons';
import styles from './NewsLetterActions.module.scss';
import { useState } from 'react';
import { Modal } from '@components/atoms';

interface NewsLetterActionsProps {
  id: string;
  email: string;
  active: boolean;
  loading?: boolean;
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
  loading,
  handleEditSubscribe,
  handleDeletesubscribe,
  handleUnsubscribe,
  error,
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
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
              setDialogOpen(true);
            }}
          >
            <IconeDelete />
          </button>
        </span>
      </Field>
      {dialogOpen && (
        <Modal
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          <ConfirmAction
            constraint={email}
            cancel={() => {
              setDialogOpen(false);
            }}
            confirm={() => {
              handleDeletesubscribe(id);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default NewsLetterActions;
