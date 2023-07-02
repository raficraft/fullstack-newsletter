import { IconSettings, IconCross } from '@assets/svg/icons';
import '@styles/globals.scss';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const link = router.pathname === '/admin' ? '/' : '/admin';
  const title =
    router.pathname === '/admin' ? 'Close admin' : 'Go to Admin page';
  const IconComponent = router.pathname === '/admin' ? IconCross : IconSettings;

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
