import styles from '../styles/Login.module.scss';
import Head from 'next/head';
import { getProviders, signIn } from 'next-auth/react';

export default function Login({ providers }) {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Head>
      <div className={styles['center-container']}>
        <div className={styles.login}>
          <h1 className={styles.login__heading}>Login</h1>
          <ul className={styles.login__list}>
            {Object.values(providers).map((provider) => (
              <li className={styles.login__list__item} key={provider.name}>
                <button
                  className={'button button--outlined'}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                >
                  Sign in with {provider.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}
