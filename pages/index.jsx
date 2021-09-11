import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

export default function Home({ session }) {
  return (
    <>
      <Link href="/login">
        <a>login</a>
      </Link>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: { session } };
}
