import { Button } from '@components/atoms';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsletterStore, { StoreActions } from '@store/useNewsletterStore';
import { FormEvent } from 'react';

type Props = {
  onSuccessfulSubmit: (email: string) => void;
};

const SubscribeNewsletter: React.FC<Props> = ({ onSuccessfulSubmit }) => {
  const { errorApi, subscribe, setErrorApi, loading, currentAction } =
    useNewsletterStore();

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

      const response = await subscribe(email);

      if (!response.error) {
        resetFormErrors();
        onSuccessfulSubmit(email);
      }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (validateField(event)) {
      resetFormErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate role='form'>
      <Field
        id='newsletter'
        name='newsletter'
        type='email'
        required
        className='bloc_input'
        placeholder='email@company.com'
        errorPosition='label'
        onChange={handleEmailChange}
        error={errors.newsletter || errorApi}
        style={{ marginBottom: '1.5rem' }}
      >
        <label htmlFor='newsletter'>Email address</label>
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
