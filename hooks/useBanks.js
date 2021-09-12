import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useBanks() {
  const { data, error } = useSWR('/api/bank', fetcher);

  return {
    banks: data?.data,
    isLoading: (!data && !error) || !data?.ok,
    isError: error,
  };
}
