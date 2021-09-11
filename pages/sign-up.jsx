import styles from '../styles/Login.module.scss';
import * as Yup from 'yup';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useFormik } from 'formik';

export default function SignUp() {
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(1, 'Name must be at least 1 character long')
        .max(30, 'Name must be 40 characters or less')
        .required('Name is required'),
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
        <title>Sign Up</title>
        <meta name="description" content="Sign up page" />
      </Head>
      <div className={styles['center-container']}>
        <div className={styles.login}>
          <h1 className={styles.login__heading}>Sign up</h1>
          <form
            className={styles.login__form}
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
          >
            <div className={styles.login__form__item}>
              <label className={styles.login__form__item__label} htmlFor="name">
                Name:
              </label>
              <div className={styles.login__form__item__wrapper}>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  className={styles.login__form__item__wrapper__input}
                  {...formik.getFieldProps('name')}
                />
              </div>
              {/* add error handling */}
            </div>
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
            Already have an account?
            <br />
            <Link href="/login">
              <a>Login!</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
