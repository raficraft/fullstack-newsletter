import { Button } from '@components/atoms';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsLetterAPI from '@hooks/useNewsLetterAPI/useNewsLetterApi';
import { debounce } from '@utils/debounce/debounce';
import { FormEvent } from 'react';

type Props = {
  onSuccessfulSubmit: (email: string) => void;
};

const SubscribeNewsletter: React.FC<Props> = ({ onSuccessfulSubmit }) => {
  const { errorApi, subscribe } = useNewsLetterAPI();

  const { validateForm, validateField, errors, getFormData, reset } = useForm({
    fields: {
      newsletter: {
        required: {
          message: 'Email required',
        },
        pattern: {
          message: 'Valid email required',
        },
      },
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(errorApi);

    if (validateForm(event)) {
      const dataForm = getFormData(event);
      const email = dataForm.newsletter;
      subscribe(email);

      if (errorApi) {
        onSuccessfulSubmit(email);
        reset();
      }
    }
  };

  const handleEmailChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      console.log(validateField(event));
      if (validateField(event)) {
        reset();
      }
    },
    300
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        type='text'
        className='input'
        placeholder='email@company.com'
        errorPosition='label'
        name='newsletter'
        onChange={handleEmailChange}
        error={errors.newsletter || errorApi}
        pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$'
        required
      >
        <label htmlFor='newsletter'>Email adress</label>
      </Field>
      <Button type='submit' className='button'>
        Subscribe to monthly newsletter
      </Button>
    </form>
  );
};

export default SubscribeNewsletter;
