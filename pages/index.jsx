import styles from '../styles/Home.module.css';
import Cookies from 'cookies';

export default function Home() {
  return <div className={styles.container}>Hello world</div>;
}

export function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res);
  const token = cookies.get('__banking_cookie');

  if (!token)
    return {
      redirect: {
        destination: '/login',
      },
    };
}
