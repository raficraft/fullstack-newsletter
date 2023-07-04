import { Button } from '@components/atoms';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';
import { debounce } from '@utils/debounce/debounce';
import { FormEvent, useEffect } from 'react';

type Props = {
  onSuccessfulSubmit: (email: string) => void;
};

const SubscribeNewsletter: React.FC<Props> = ({ onSuccessfulSubmit }) => {
  const { errorApi, subscribe, setErrorApi, loading, currentAction } =
    useNewsLetterStore();

  const {
    validateForm,
    validateField,
    errors,
    getFormData,
    reset: resetFormErrors,
  } = useForm({
    fields: {
      newsletter: {
        required: {
          message: 'Email required',
        },
        typeMismatch: {
          message: 'Valid Email Required',
        },
      },
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm(event)) {
      const dataForm = getFormData(event);
      const email = dataForm.newsletter;

      try {
        await subscribe(email);
        onSuccessfulSubmit(email);
        resetFormErrors();
      } catch (error: any) {
        setErrorApi(error.message);
      }
    }
  };

  const handleEmailChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (validateField(event)) {
        resetFormErrors();
      }
    },
    300
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        type='email'
        className='bloc_input'
        placeholder='email@company.com'
        errorPosition='label'
        name='newsletter'
        onChange={handleEmailChange}
        error={errors.newsletter || errorApi}
        required
        style={{ marginBottom: '1.5rem' }}
      >
        <label htmlFor='newsletter'>Email adress</label>
      </Field>
      <Button
        type='submit'
        className='btn_primary fullWidth'
        loading={loading && StoreActions.INSERT === currentAction}
      >
        Subscribe to monthly newsletter
      </Button>
    </form>
  );
};

export default SubscribeNewsletter;
