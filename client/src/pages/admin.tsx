import { NewslettersActions, Pagination } from '@components/molecules';
import { AdminHeader } from '@components/organisms';
import { usePaginate } from '@hooks/index';
import useNewsletterStore from '@store/useNewsletterStore';
import styles from '@styles/pages/Admin.module.scss';
import { Int_Newsletter } from '__mocks__/data/data';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

export default function Admin({
  newsletters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, setData } = useNewsletterStore();
  const currentData = !data.length ? newsletters : data;
  const { items, nextPage, prevPage, currentPage, totalPages } = usePaginate(
    currentData,
    5
  );

  useEffect(() => {
    console.log(data);
    console.log('reload', currentData);
    setData(currentData);
  }, [data]);

  return (
    <>
      <Head>
        <title>Newsletters Admin</title>
        <meta name='description' content='Newsletters' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.admin} data-testid='admin-page'>
        <AdminHeader />
        <div className={styles.input_list}>
          {items && items.length > 0 ? (
            items.map((item, key) => (
              <NewslettersActions
                key={`email_${key}`}
                id={item.id}
                email={item.email}
                active={item.active}
              />
            ))
          ) : (
            <p>Aucun élément à afficher.</p>
          )}
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
    const newsletters = await res.json();
    return newsletters;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const newsletters: Int_Newsletter[] = await loadNewsletter();
    return { props: { newsletters } };
  } catch (err) {
    throw new Error('Error fetching newsletters');
  }
};
