import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Head from 'next/head';
import { getSession } from 'next-auth/react';

export default function Home({ session }) {
  return (
    <>
      <Head>
        <title>Banking App</title>
        <meta name="description" content="some banks..." />
      </Head>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: { session } };
}
