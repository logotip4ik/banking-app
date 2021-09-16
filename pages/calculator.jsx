import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useFormik } from 'formik';
import Head from 'next/head';
import Select from 'react-select';
import useBanks from '../hooks/useBanks';
import styles from '../styles/Calculator.module.scss';

export default function Calculator({ userBanks }) {
  const { banks, isLoading, isError } = useBanks();

  const [mortgage, setMortgage] = useState(0);

  const formik = useFormik({
    initialValues: {
      loan: 1,
      downPayment: 0.01,
      selectedBank: null,
    },
    validate: (form) => {
      if (!form.selectedBank || !form.selectedBank.name) return false;
      if (form.loan > 0 && form.loan < form.selectedBank.maxLoan) return false;
      if (form.downPayment > 0 && form.down < form.selectedBank.maxDownPayment)
        return false;

      return true;
    },
    onSubmit: (values) => {
      if (!values.selectedBank) return;
      const annualInterestRate = values.selectedBank.interestRate;
      const numberOfPayments = Math.ceil(values.selectedBank.loanTerm / 31);

      const firstMultiplier = values.loan * (annualInterestRate / 12);
      const secondMultiplier =
        (1 + annualInterestRate / 12) ** numberOfPayments;
      const divider = secondMultiplier - 1;

      const monthlyPayment = (firstMultiplier * secondMultiplier) / divider;
      setMortgage(monthlyPayment);
    },
  });

  if (isError) return <h1>Oops...</h1>;

  return (
    <>
      <Head>
        <title>Mortgage Calculator</title>
        <meta
          name="description"
          content="Calculate mortgage based on your banks"
        />
      </Head>
      <div className={styles.main}>
        <h1 className={styles.main__header}>Mortgage Calculator</h1>
        <form
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
          className={styles.main__form}
        >
          <div className={styles.main__form__item}>
            <label className={styles.main__form__item__label} htmlFor="loan">
              Initial Loan:
            </label>
            <input
              name="loan"
              min="1"
              type="number"
              className={styles.main__form__item__input}
              {...formik.getFieldProps('loan')}
            />
          </div>
          <div className={styles.main__form__item}>
            <label
              className={styles.main__form__item__label}
              htmlFor="down_payment"
            >
              Down payment:
            </label>
            <input
              name="down_payment"
              type="number"
              min="0.01"
              step="0.01"
              max="1"
              className={styles.main__form__item__input}
              {...formik.getFieldProps('downPayment')}
            />
          </div>
          <div className={styles.main__form__item}>
            <label className={styles.main__form__item__label} htmlFor="bank">
              Select bank:
            </label>
            <Select
              name="bank"
              isLoading={isLoading}
              options={
                banks
                  ? banks.reduce(
                      (acc, bank) => [
                        ...acc,
                        { value: bank, label: bank.name },
                      ],
                      [],
                    )
                  : []
              }
              onChange={(bank) =>
                formik.setFieldValue('selectedBank', bank.value)
              }
              // TODO: style this select
              className={styles.main__form__item__select}
            ></Select>
          </div>
          <div
            className={`${styles.main__form__item} ${styles['main__form__item--right']}`}
          >
            <button type="submit" className="button">
              Calculate
            </button>
            <button type="reset" className="button button--outlined">
              Reset
            </button>
          </div>
        </form>
        <h1 className={styles.main__mortgage}>Monthly Payment: {mortgage}</h1>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: {} };
}
