import styles from './SearchWord.module.scss';
import React, { FormEvent, forwardRef, useEffect, useRef } from 'react';
import { IconMagnify } from '@assets/svg/icons';
import { Field } from '@molecules/index';
import { useForm } from '@hooks/index';
import { debounce } from '@utils/debounce/debounce';
import useApiStore from '@store/useDictionaryAPI/useDictionaryApi';

const SearchWord: React.ForwardRefRenderFunction<HTMLFormElement> = (
  {},
  ref
) => {
  const { fetchData, word, loading } = useApiStore();
  const { validateForm, validateField, errors, getFormData } = useForm({
    fields: {
      search: {
        required: {
          message: 'Whoops, can’t be empty…',
        },
        pattern: {
          message: 'You can only use alphabetic characters',
        },
      },
    },
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    const dataForm = getFormData(event);
    event.preventDefault();
    if (validateForm(event)) {
      fetchData(dataForm.search);
    } else {
      fetchData(dataForm.search);
    }
  };

  const handleChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const searchValue = event.target.value;
      if (validateField(event)) {
        fetchData(searchValue);
      } else {
        fetchData(searchValue);
      }
    },
    300
  );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = word;
    }
  }, [word]);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      ref={ref}
      role='form'
    >
      <Field
        type='search'
        placeholder='Search for any word'
        name='search'
        ref={searchInputRef}
        required
        maxLength={32}
        pattern='^[a-zA-ZÀ-ÿ ]+$'
        onChange={handleChange}
        error={errors.search}
        className={`input ${errors.search ? 'input_invalid' : ''}`}
        defaultValue={word}
        loading={loading}
        svg={
          <span className={styles.icon}>
            <IconMagnify />
          </span>
        }
      />
    </form>
  );
};

export default forwardRef(SearchWord);
