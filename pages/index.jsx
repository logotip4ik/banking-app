import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import useBanks from '../hooks/useBanks';

export default function Home({ session }) {
  const { banks, isLoading, isError } = useBanks();

  if (isError) return <h1>Something went wrong...</h1>;

  return (
    <>
      <Head>
        <title>Banking App</title>
        <meta name="description" content="some banks..." />
      </Head>
      <AnimatePresence exitBeforeEnter>
        {isLoading ? (
          <motion.h1
            key={'loading'}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading...
          </motion.h1>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={'banks'}
          >
            {JSON.stringify(banks, null, 2)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: { session } };
}
