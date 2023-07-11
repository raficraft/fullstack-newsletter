import Head from 'next/head';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { NewsLetterActions, Pagination } from '@components/molecules';
import { usePaginate } from '@hooks/index';
import styles from '@styles/pages/Admin.module.scss';
import { AdminHeader } from '@components/organisms';
import useNewsLetterStore from '@store/useNewsletterStore';

export default function Admin({
  newsLetters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, setData } = useNewsLetterStore();
  const currentData = newsLetters || data;
  const { items, nextPage, prevPage, currentPage, totalPages } = usePaginate(
    currentData,
    5
  );

  useEffect(() => {
    setData(currentData);
  }, [data]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='NewsLetter' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.admin}>
        <AdminHeader />
        <div className={styles.input_list}>
          {items.map((item, key) => (
            <NewsLetterActions
              key={`email_${key}`}
              id={item.id}
              email={item.email}
              active={item.active}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        )}
      </main>
    </>
  );
}

export async function loadNewsletter() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${url}newsletter/registered`);
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
