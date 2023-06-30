// NewsletterField.jsx
import { Field } from '@components/molecules';
import { IconeDelete, IconeUnsubscribe } from '@assets/svg/icons';

export const AdminSubscribeNewsLetter = ({
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
        handleEditSubscribe(id, event);
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
