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
  validation: any;
}

export const NewsLetterActions: React.FC<NewsLetterActionsProps> = ({
  id,
  email,
  active,
  error,
  validation,
}) => {
  const {
    editSubscribe,
    deleteSubscribe,
    toggleSubscribe,
    loading,
    currentActiveElement,
    currentAction,
    errorApi,
    setErrorApi,
  } = useNewsLetterStore();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const showLoading = loading && currentActiveElement === id;
  const errorField = currentActiveElement === id ? errorApi || error : '';

  const handleEdit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    try {
      if (validation(event)) {
        await editSubscribe(id, event.target.value);
      }
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  const handleToggle = () => {
    try {
      toggleSubscribe(id, !active);
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  const handleDelete = () => {
    try {
      deleteSubscribe(id);
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

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
          handleEdit(event);
        }}
        error={errorField}
        {...(!active && { disabled: true })}
      >
        <span className={styles.newsLetterAction}>
          <button
            className={`btn_icon ${active ? 'btn_purple' : 'btn_green'}`}
            type='button'
            title={active ? 'Unsubscribe' : 'Subscribe'}
            onClick={handleToggle}
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
            confirm={handleDelete}
          />
        </Modal>
      )}
    </>
  );
};

export default NewsLetterActions;
