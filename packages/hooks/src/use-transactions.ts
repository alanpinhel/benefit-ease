import { Transaction } from "@repo/types";
import useSWR from "swr";

export function useTransactions(query?: string) {
  const response = useSWR<Transaction[]>(
    `/rest/v1/transactions?select=id,name,created_at,amount,accounts(benefits(icon))&order=created_at.desc${query}`
  );
  return {
    transactions: response.data || [],
    hasErrorTransactions: !!response.error,
    isLoadingTransactions: response.isLoading,
    ...response,
  };
}
