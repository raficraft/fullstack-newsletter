import { IconMagnify } from '@assets/svg/icons';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';
import { debounce } from '@utils/debounce/debounce';
import { ChangeEvent, HTMLAttributes } from 'react';

interface AdminSearchProps extends HTMLAttributes<HTMLDivElement> {
  children?: any;
}

const AdminSearch: React.FC<AdminSearchProps> = ({ className, children }) => {
  const { validateField, errors, reset } = useForm({
    fields: {
      search: {
        required: {
          message: 'Value required',
        },
        minLength: {
          message: 'Two characters minimum',
        },
      },
    },
  });

  const { searchSubscriber, loading, currentAction } = useNewsLetterStore();

  const handleChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (validateField(event)) {
      searchSubscriber(event.target.value);
      reset();
    }
  }, 300);

  return (
    <Field
      type='search'
      className={`bloc_input ${className}`}
      placeholder='find a subscriber'
      name='search'
      svg={<IconMagnify />}
      minLength={2}
      required
      loading={loading && currentAction === StoreActions.SEARCH}
      error={errors.search}
      onChange={handleChange}
      onSubmit={handleChange}
      reverse
    >
      {children}
    </Field>
  );
};

export default AdminSearch;
