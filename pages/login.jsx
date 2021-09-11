import styles from '../styles/Login.module.scss';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useFormik } from 'formik';

export default function Login() {
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Not valid email')
        .min(3, 'Email must be at least 3 characters long')
        .max(60, 'Email must be 60 characters or less')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(30, 'Password must be 30 characters or less')
        .required('Password is required'),
    }),
    onSubmit: ({ email, password }) => {
      console.log('Submitted form with this values: ', { email, password });
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Head>
      <div className={styles['center-container']}>
        <div className={styles.login}>
          <h1 className={styles.login__heading}>Login</h1>
          <form
            className={styles.login__form}
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
          >
            <div className={styles.login__form__item}>
              <label
                className={styles.login__form__item__label}
                htmlFor="email"
              >
                Email:
              </label>
              <div className={styles.login__form__item__wrapper}>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  className={styles.login__form__item__wrapper__input}
                  {...formik.getFieldProps('email')}
                />
              </div>
              {/* add error handling */}
            </div>
            <div className={styles.login__form__item}>
              <label
                className={styles.login__form__item__label}
                htmlFor="password"
              >
                Password:
              </label>
              <div className={styles.login__form__item__wrapper}>
                <input
                  type={isShowingPassword ? 'text' : 'password'}
                  name="password"
                  className={styles.login__form__item__wrapper__input}
                  {...formik.getFieldProps('password')}
                />
              </div>
              {/* add error handling */}
            </div>
            <div
              className={`${styles.login__form__item} ${styles['login__form__item--actions']}`}
            >
              <button type="submit" className="button">
                Login
              </button>
              <button type="reset" className="button button--outlined">
                Reset
              </button>
            </div>
          </form>
          <div className={styles['login__horizontal-line']}></div>
          <div className={styles.login__info}>
            Don&apos;t have an account yet?
            <br />
            <Link href="/sign-up">
              <a>Sign up!</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
