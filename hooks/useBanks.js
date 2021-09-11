import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useBanks() {
  const { data, error } = useSWR('/api/bank', fetcher);

  return {
    banks: data,
    isLoading: !data && !error,
    isError: error,
  };
}
