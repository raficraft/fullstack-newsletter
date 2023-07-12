import { IconMagnify } from '@assets/svg/icons';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsletterStore, { StoreActions } from '@store/useNewsletterStore';
import { ChangeEvent, HTMLAttributes } from 'react';

interface AdminSearchProps extends HTMLAttributes<HTMLFormElement> {
  children?: any;
}

const AdminSearch: React.FC<AdminSearchProps> = ({
  className = '',
  children,
  ...rest
}) => {
  const {
    validateField,
    validateForm,
    errors,
    setErrors,
    reset: resetFormErrors,
    getFormData,
  } = useForm({
    fields: {
      search: {
        required: {
          message: 'Value required',
        },
        pattern: {
          message: 'Two characters minimum sixty four maximum',
        },
      },
    },
  });

  const { searchSubscriber, loading, currentAction } = useNewsletterStore();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (validateField(event)) {
      resetFormErrors();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm(event)) {
      const formElement = getFormData(event);
      const response = await searchSubscriber(formElement.search);

      if (response && !response.data.length) {
        setErrors((state: any) => ({ ...state, search: 'No result' }));
      } else {
        resetFormErrors();
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} style={{ flexGrow: 1 }} {...rest}>
      <Field
        type='search'
        className={`bloc_input ${className}`}
        placeholder='Find a subscriber'
        name='search'
        svg={<IconMagnify />}
        pattern='^.{2,64}$'
        required
        loading={loading && currentAction === StoreActions.SEARCH}
        error={errors.search}
        onChange={handleChange}
        onSubmit={handleChange}
        reverse
      >
        {children}
      </Field>
    </form>
  );
};

export default AdminSearch;
