import { IconUnsubscribe, IconeDelete, IconeEnabled } from '@assets/svg/icons';
import { Modal } from '@components/atoms';
import Spinner from '@components/atoms/Spinner/Spinner';
import { ConfirmAction, Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsletterStore, { StoreActions } from '@store/useNewsletterStore';
import { useState } from 'react';
import styles from './NewsletterAction.module.scss';

interface NewslettersActionsProps {
  id: string;
  email: string;
  active: boolean;
}

export const NewslettersActions: React.FC<NewslettersActionsProps> = ({
  id,
  email,
  active,
}) => {
  const {
    editSubscribe,
    deleteSubscribe,
    toggleSubscribe,
    loading,
    currentActiveElement,
    currentAction,
    errorApi,
    setCurrentActiveElement,
  } = useNewsletterStore();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailEdit, setEmailEdit] = useState<string>(email);
  const showLoading = loading && currentActiveElement === id;

  const { validateField, validateForm, errors } = useForm({
    fields: {
      [`email_${id}`]: {
        required: {
          message: 'Email required',
        },
        typeMismatch: {
          message: 'Valid email required',
        },
      },
    },
  });

  const errorField =
    currentActiveElement === id ? errorApi || errors[`email_${id}`] : '';

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (validateForm(event)) {
      await editSubscribe(id, emailEdit);
    }
  };

  const handleToggle = async () => {
    await toggleSubscribe(id, !active);
  };

  const handleDelete = async () => {
    await deleteSubscribe(id);
  };

  return (
    <>
      <form
        noValidate
        onSubmit={(event) => {
          handleSubmit(event);
        }}
        data-testid='form'
      >
        <Field
          reverse
          type='email'
          className={`bloc_input ${styles.admin_input}`}
          key={`email_${id}`}
          name={`email_${id}`}
          loading={showLoading && currentAction === StoreActions.EDIT}
          defaultValue={email}
          onFocus={() => {
            setCurrentActiveElement(id);
          }}
          onChange={(event) => {
            setCurrentActiveElement(id);
            if (validateField(event)) {
              setEmailEdit(event.target.value);
            }
          }}
          error={errorField}
          {...(!active && { disabled: true })}
          placeholder='Edit email'
          required
        >
          <span className={styles.newsLetterAction}>
            <button
              className={`btn_icon ${active ? 'btn_purple' : 'btn_green'}`}
              type='button'
              title={active ? 'Unsubscribe' : 'Subscribe'}
              onClick={handleToggle}
              data-testid='toggle'
            >
              {showLoading && currentAction == StoreActions.TOGGLE ? (
                <Spinner style={{ borderColor: 'white' }} />
              ) : active ? (
                <IconUnsubscribe data-testid='iconUnsubscribe' />
              ) : (
                <IconeEnabled data-testid='iconEnabled' />
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
                <IconeDelete data-testid='iconDelete' />
              )}
            </button>
          </span>
        </Field>
      </form>
      {dialogOpen && (
        <Modal
          close={() => {
            setDialogOpen(false);
          }}
        >
          <ConfirmAction
            constraint={email}
            close={() => {
              setDialogOpen(false);
            }}
            confirm={handleDelete}
          />
        </Modal>
      )}
    </>
  );
};

export default NewslettersActions;
