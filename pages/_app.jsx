import '../styles/globals.scss';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <SessionProvider session={pageProps.session}>
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
