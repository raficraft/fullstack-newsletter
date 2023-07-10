import { IconMagnify } from '@assets/svg/icons';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';
import { debounce } from '@utils/debounce/debounce';
import { ChangeEvent, HTMLAttributes, useEffect } from 'react';

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
    reset: resetFormErrors,
    getFormData,
    setErrors,
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

  const { searchSubscriber, loading, currentAction } = useNewsLetterStore();

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
      resetFormErrors();

      if (!response.data.length) {
        setErrors((state: any) => ({ ...state, search: 'No result' }));
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
