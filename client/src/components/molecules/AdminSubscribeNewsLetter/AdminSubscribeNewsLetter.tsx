import { Field } from '@components/molecules';
import { IconeDelete, IconeUnsubscribe } from '@assets/svg/icons';
import { ChangeEvent } from 'react';

interface AdminSubscribeNewsLetterProps {
  id: string;
  email: string;
  active: boolean;
  handleEditSubscribe: (id: string, value: string) => void;
  handleDeletesubscribe: (id: string) => void;
  handleUnsubscribe: (id: string, active: boolean) => void;
  error?: string;
}

export const AdminSubscribeNewsLetter: React.FC<
  AdminSubscribeNewsLetterProps
> = ({
  id,
  email,
  active,
  handleEditSubscribe,
  handleDeletesubscribe,
  handleUnsubscribe,
  error,
}) => {
  return (
    <Field
      reverse
      type='email'
      className='input'
      key={`email_${id}`}
      name={`email_${id}`}
      defaultValue={email}
      onChange={(event) => {
        handleEditSubscribe(id, event.target.value);
      }}
      error={error}
      {...(!active && { disabled: true })}
    >
      <span>
        <button
          type='button'
          onClick={() => {
            handleDeletesubscribe(id);
          }}
        >
          <IconeDelete />
        </button>
        <button type='button'>
          <IconeUnsubscribe
            onClick={() => {
              handleUnsubscribe(id, !active);
            }}
          />
        </button>
      </span>
    </Field>
  );
};

export default AdminSubscribeNewsLetter;
