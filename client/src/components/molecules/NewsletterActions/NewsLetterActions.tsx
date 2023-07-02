import { ConfirmAction, Field } from '@components/molecules';
import {
  IconCross,
  IconUnsubscribe,
  IconeDelete,
  IconeEnabled,
} from '@assets/svg/icons';
import styles from './NewsLetterActions.module.scss';
import { useEffect, useState } from 'react';
import { Modal } from '@components/atoms';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';
import Spinner from '@components/atoms/Spinner/Spinner';

interface NewsLetterActionsProps {
  id: string;
  email: string;
  active: boolean;
  error?: string;
}

export const NewsLetterActions: React.FC<NewsLetterActionsProps> = ({
  id,
  email,
  active,
  error,
}) => {
  const {
    editSubscribe,
    deleteSubscribe,
    toggleSubscribe,
    loading,
    currentActiveElement,
    currentAction,
  } = useNewsLetterStore();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const showLoading = loading && currentActiveElement === id;

  return (
    <>
      <Field
        reverse
        type='email'
        className={`bloc_input ${styles.admin_input}`}
        key={`email_${id}`}
        name={`email_${id}`}
        loading={showLoading && currentAction === StoreActions.EDIT}
        defaultValue={email}
        onChange={(event) => {
          editSubscribe(id, event.target.value);
        }}
        error={error}
        {...(!active && { disabled: true })}
      >
        <span className={styles.newsLetterAction}>
          <button
            className={`btn_icon ${active ? 'btn_purple' : 'btn_green'}`}
            type='button'
            title={active ? 'Unsubscribe' : 'Subscribe'}
            onClick={() => {
              toggleSubscribe(id, !active);
            }}
          >
            {showLoading && currentAction == StoreActions.TOGGLE ? (
              <Spinner style={{ borderColor: 'white' }} />
            ) : active ? (
              <IconUnsubscribe />
            ) : (
              <IconeEnabled />
            )}
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
            {showLoading && currentAction === StoreActions.DELETE ? (
              <Spinner />
            ) : (
              <IconeDelete />
            )}
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
              deleteSubscribe(id);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default NewsLetterActions;
