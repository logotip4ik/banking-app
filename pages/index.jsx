import styles from '../styles/Home.module.scss';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import useBanks from '../hooks/useBanks';
import Navbar from '../components/Navbar';

export default function Home({ session }) {
  const { banks, isLoading, isError } = useBanks();

  if (isError) return <h1>Something went wrong...</h1>;

  return (
    <>
      <Head>
        <title>Banking App</title>
        <meta name="description" content="some banks..." />
      </Head>
      <Navbar
        username={session.user.name}
        profilePic={session.user.image}
      ></Navbar>
      <div className={styles.main}>
        <AnimatePresence exitBeforeEnter>
          {isLoading ? (
            <motion.h1
              key={'loading'}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.main__heading}
            >
              Loading...
            </motion.h1>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={'banks'}
              className={styles.main__content}
            >
              <div className={styles.main__content__header}>
                <h2 className={styles.main__content__header__text}>
                  Your Banks:{' '}
                </h2>
                <button className={styles.main__content__header__button}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
              </div>
              {banks.length === 0 ? (
                <div
                  className={`${styles.main__content__list} ${styles['main__content__list--empty']}`}
                >
                  <h3>You no banks, =_=</h3>
                </div>
              ) : (
                <motion.ul className={styles.main__content__list}>
                  {banks.map((bank) => (
                    <motion.li
                      key={bank.name}
                      className={styles.main__content__list__item}
                    >
                      {JSON.stringify(bank, null, 2)}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: { session } };
}
