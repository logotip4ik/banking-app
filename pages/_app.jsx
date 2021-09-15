import '../styles/globals.scss';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import nProgress from 'nprogress';
import Navbar from '../components/Navbar';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeComplete', nProgress.done);
Router.events.on('routeChangeError', nProgress.done);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        {/* nProgress styles */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/nprogress@0.2.0/nprogress.css"
        />
      </Head>
      {router.route !== '/login' && <Navbar></Navbar>}
      <AnimatePresence
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        exitBeforeEnter
      >
        <motion.div
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </SessionProvider>
  );
}

export default MyApp;
