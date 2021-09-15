import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useFormik } from 'formik';

import Select from 'react-select';
import useBanks from '../hooks/useBanks';

export default function Calculator({ userBanks }) {
  const { banks, isLoading, isError } = useBanks();

  const [mortgage, setMortgage] = useState(0);

  const formik = useFormik({
    initialValues: {
      loan: 1,
      downPayment: 0.01,
      selectedBank: null,
    },
    onSubmit: (values) => {
      console.log(values);
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
    <div>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div>
          <label htmlFor="loan">Initial Loan:</label>
          <input
            name="loan"
            min="1"
            type="number"
            {...formik.getFieldProps('loan')}
          />
        </div>
        <div>
          <label htmlFor="down_payment">Down payment:</label>
          <input
            name="down_payment"
            type="number"
            min="0.01"
            step="0.01"
            max="1"
            {...formik.getFieldProps('downPayment')}
          />
        </div>
        <div>
          <label htmlFor="bank">Select bank:</label>
          <Select
            name="bank"
            isLoading={isLoading}
            options={
              banks
                ? banks.reduce(
                    (acc, bank) => [...acc, { value: bank, label: bank.name }],
                    [],
                  )
                : []
            }
            onChange={(bank) =>
              formik.setFieldValue('selectedBank', bank.value)
            }
            // {...formik.getFieldProps('selectedBank')}
          ></Select>
        </div>
        <div>
          <button type="submit">Calculate</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      {mortgage}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) return { redirect: { destination: '/login' } };

  return { props: {} };
}
