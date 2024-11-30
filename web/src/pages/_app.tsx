// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import type { AppProps } from 'next/app';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import Head from 'next/head';
import { useRouter } from 'next/router';

const theme = createTheme({
  fontFamily: 'Inter',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#FFF" />
      </Head>
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>
          <Component key={router.asPath} {...pageProps} />
          <style jsx global>{`
            html,
            body,
            #__next {
              height: 100%;
            }
          `}</style>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
