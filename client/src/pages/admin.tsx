import Head from 'next/head';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { AdminFilter, AdminSubscribeNewsLetter } from '@components/molecules';
import { Text } from '@components/atoms';
import { useForm, usePaginate } from '@hooks/index';
import styles from '@styles/pages/Admin.module.scss';
import useNewsLetterAPI from '@hooks/useNewsLetterAPI/useNewsLetterApi';
import { AdminSearch } from '@components/organisms';
import { UseFormOptions, FieldsOptions } from '@hooks/useForm/types';
import useNewsLetterActions from '@hooks/useNewsLetterActions/UseNewsLetterActions';

export default function Admin({
  newsLetters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    data,
    errorApi,
    handleDeletesubscribe,
    handleUnsubscribe,
    handleEditSubscribe,
    handleFilter,
    handleSearch,
    loadData,
  } = useNewsLetterActions(newsLetters);
  const { items, nextPage, prevPage, currentPage, totalPages } = usePaginate(
    data,
    5
  );

  // Génére l'objet de configuration pour useForm
  const generateFormConfig = (items: any[]): UseFormOptions => {
    let fieldsConfig: FieldsOptions = {};

    items.forEach((item: any) => {
      fieldsConfig[`email_${item.id}`] = {
        required: {
          message: 'Email required',
        },
        typeMismatch: {
          message: 'Valid Email Required',
        },
      };
    });

    return { fields: fieldsConfig };
  };

  const { validateField, errors } = useForm(generateFormConfig(items));

  const handleEdit = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as string;
    if (validateField(event)) {
      handleEditSubscribe(id, value);
    }
  };

  useEffect(() => {}, [data]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.admin}>
        {items.length > 0 ? (
          <>
            {
              <>
                <AdminSearch callback={handleSearch} />
                <AdminFilter submit={handleFilter} reset={loadData} />
                <div>
                  {items.map((item) => (
                    <AdminSubscribeNewsLetter
                      key={item.id}
                      id={item.id}
                      email={item.email}
                      active={item.active}
                      handleEditSubscribe={(event) => {
                        handleEdit(item.id, event);
                      }}
                      handleDeletesubscribe={handleDeletesubscribe}
                      handleUnsubscribe={handleUnsubscribe}
                      error={errors[`email_${item.id}`]}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div>
                    <button onClick={prevPage} disabled={currentPage === 0}>
                      Prev
                    </button>
                    <Text tag='p'>
                      Page {currentPage + 1} / {totalPages}
                    </Text>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                    </button>
                  </div>
                )}
                <p>{errorApi}</p>
              </>
            }
          </>
        ) : (
          <p>No results available.</p>
        )}
      </main>
    </>
  );
}

export async function loadNewsletter() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${url}/newsletter/registered`);
    if (!res.ok) {
      throw new Error('Error loading newsletter data');
    }
    const newsLetter = await res.json();
    return newsLetter;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const newsLetters = await loadNewsletter();
  return { props: { newsLetters } };
};
