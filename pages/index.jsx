import styles from '../styles/Home.module.scss';
import modalStyles from '../styles/Modal.module.scss';
import Head from 'next/head';
import ReactModal from 'react-modal';
import { useCallback, useState, useRef, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useSWRConfig } from 'swr';
import useBanks from '../hooks/useBanks';
import Navbar from '../components/Navbar';

let isEditing = null;

export default function Home({ session }) {
  const { banks, isLoading, isError } = useBanks();
  const [isShowingModal, setIsShowingModal] = useState(false);
  const { mutate } = useSWRConfig();

  const inputRef = useRef();

  const formik = useFormik({
    initialValues: {
      name: '',
      interestRate: 0.01,
      maxLoan: 10000,
      maxDownPayment: 0.2,
      loanTerm: 372,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(1, 'Bank name must contain at least 1 character')
        .max(50, 'Bank name must contain at most 50 characters')
        .required('Bank name is required'),
      interestRate: Yup.number()
        .min(0.01, 'Interest rate must be least 0.01')
        .max(1, 'Interest rate must be most 1')
        .required('Interest rate is required'),
      maxLoan: Yup.number()
        .min(1, 'Maximum loan must be at least 1 dollar')
        .max(9999999, 'Maximum loan must be at most 9999999 dollars')
        .required('Maximum loan is required'),
      maxDownPayment: Yup.number()
        .min(0.01, 'Minimum down payment must be least 0.01')
        .max(1, 'Minimum down payment must be most 1')
        .required('Minimum down payment is required'),
      loanTerm: Yup.number()
        .min(1, 'Loan term must be least 1 day')
        // 10 years
        .max(365 * 10, 'Loan term must be at most 10 years')
        .required('Loan term is required'),
    }),
    onSubmit: (form) => {
      let url = '/api/bank';
      if (isEditing) url += `/${isEditing}`;
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(form),
      }).then((res) => {
        if (res.ok) setIsShowingModal(false);
        mutate('/api/bank');
      });
    },
  });

  const addBank = useCallback(() => {
    Object.keys(formik.values).forEach(
      (key) => (formik.values[key] = formik.initialValues[key]),
    );
    isEditing = null;
    setIsShowingModal(true);
  }, [formik]);
  const editBank = useCallback(
    (bank) => {
      Object.keys(bank).forEach((key) =>
        formik.values[key] !== undefined
          ? (formik.values[key] = bank[key])
          : null,
      );
      isEditing = bank.id;
      setIsShowingModal(true);
    },
    [formik],
  );
  const deleteBank = useCallback(
    ({ id }) => {
      fetch(`/api/bank/${id}`, { method: 'DELETE' }).then(({ ok }) =>
        ok ? mutate('/api/bank') : null,
      );
    },
    [mutate],
  );

  if (isError) return <h1>Something went wrong...</h1>;
  // TODO: add mortage calculator and fetch the user banks
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
                <button
                  className={styles.main__content__header__button}
                  onClick={() => addBank()}
                >
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
                <table className={styles.main__content__table} width="100">
                  <thead className={styles.main__content__table__head}>
                    <tr>
                      <th>Name</th>
                      <th>Interest Rate</th>
                      <th>Max Loan</th>
                      <th>Max Down Payment</th>
                      <th>Loan Term</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={styles.main__content__table__body}>
                    {banks.map((bank) => (
                      <tr key={bank.name}>
                        {Object.keys(bank)
                          .map((key) => {
                            if (key === 'id') return;
                            if (key === 'bankUserId') return;
                            return (
                              <td key={`${bank.name}-${key}`} align="center">
                                {bank[key]}
                              </td>
                            );
                          })
                          .filter(Boolean)}
                        <td
                          className={styles.main__content__table__body__buttons}
                        >
                          <button
                            onClick={() => editBank(bank)}
                            className={
                              styles.main__content__table__body__buttons__button
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteBank(bank)}
                            className={
                              styles.main__content__table__body__buttons__button
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ReactModal
        isOpen={isShowingModal}
        onRequestClose={() => {
          setIsShowingModal(false);
          formik.resetForm();
        }}
        preventScroll
        className={modalStyles.modal}
        closeTimeoutMS={300}
        onAfterOpen={() => inputRef.current.focus()}
      >
        <h1 className={modalStyles.modal__heading}>
          {!formik.values.name ? 'New' : null} Bank
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          onReset={() => {
            formik.resetForm();
            setIsShowingModal(false);
          }}
          className={modalStyles.modal__form}
        >
          <div className={modalStyles.modal__form__item}>
            <label
              htmlFor="bank_name"
              className={modalStyles.modal__form__item__label}
            >
              Name:
            </label>
            <input
              name="bank_name"
              type="text"
              className={modalStyles.modal__form__item__input}
              ref={inputRef}
              {...formik.getFieldProps('name')}
            />
          </div>
          <div className={modalStyles.modal__form__item}>
            <label
              htmlFor="bank_interest_rate"
              className={modalStyles.modal__form__item__label}
            >
              Interest Rate:
            </label>
            <input
              name="bank_interest_rate"
              type="number"
              min="0.01"
              step="0.01"
              max="1"
              className={modalStyles.modal__form__item__input}
              {...formik.getFieldProps('interestRate')}
            />
          </div>
          <div className={modalStyles.modal__form__item}>
            <label
              htmlFor="bank_maximum_loan"
              className={modalStyles.modal__form__item__label}
            >
              Maximum loan:
            </label>
            <input
              name="bank_maximum_loan"
              type="number"
              min="1"
              step="1"
              max="9999999"
              className={modalStyles.modal__form__item__input}
              {...formik.getFieldProps('maxLoan')}
            />
          </div>
          <div className={modalStyles.modal__form__item}>
            <label
              htmlFor="bank_minimum_down_payment"
              className={modalStyles.modal__form__item__label}
            >
              Minimum Down Payment:
            </label>
            <input
              name="bank_minimum_down_payment"
              type="number"
              min="0.01"
              step="0.01"
              max="1"
              className={modalStyles.modal__form__item__input}
              {...formik.getFieldProps('maxDownPayment')}
            />
          </div>
          <div className={modalStyles.modal__form__item}>
            <label
              htmlFor="bank_loan_term"
              className={modalStyles.modal__form__item__label}
            >
              Loan Term:
            </label>
            {/* TODO: made days or month or years selector */}
            <input
              name="bank_loan_term"
              type="number"
              min="1"
              step="1"
              max="3650"
              className={modalStyles.modal__form__item__input}
              {...formik.getFieldProps('loanTerm')}
            />
          </div>
          <div
            className={`${modalStyles.modal__form__item} ${modalStyles['modal__form__item--center']}`}
          >
            <button className={'button'} type="submit">
              Save
            </button>
            <button className={'button button--outlined'} type="reset">
              Reset
            </button>
          </div>
        </form>
      </ReactModal>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: { session } };
}
