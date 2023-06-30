import { IconMagnify } from '@assets/svg/icons';
import { Field } from '@components/molecules';
import { useForm } from '@hooks/index';
import { debounce } from '@utils/debounce/debounce';
import { ChangeEvent, useEffect } from 'react';

interface AdminSearchProps {
  callback: (value: string) => void;
}

const AdminSearch: React.FC<AdminSearchProps> = ({ callback }) => {
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

  const handleChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (validateField(event)) {
      callback(event.target.value);
      reset();
    }
  }, 300);

  return (
    <Field
      type='search'
      className='input'
      placeholder='find a subscriber'
      name='search'
      svg={<IconMagnify />}
      minLength={2}
      required
      error={errors.search}
      onChange={handleChange}
      onSubmit={handleChange}
    />
  );
};

export default AdminSearch;
