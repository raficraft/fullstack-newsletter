import { IconSettings, IconCross } from '@assets/svg/icons';
import useNewsLetterStore from '@store/useNewsletterStore';
import '@styles/globals.scss';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { setErrorApi } = useNewsLetterStore();

  const link = router.pathname === '/admin' ? '/' : '/admin';
  const title =
    router.pathname === '/admin' ? 'Close admin' : 'Go to Admin page';
  const IconComponent = router.pathname === '/admin' ? IconCross : IconSettings;

  useEffect(() => {
    return () => {
      setErrorApi('');
    };
  }, [router.pathname]);

  return (
    <>
      <Component {...pageProps} />
      <Link href={link}>
        <div className='admin_link' title={title}>
          <IconComponent />
        </div>
      </Link>
    </>
  );
}
