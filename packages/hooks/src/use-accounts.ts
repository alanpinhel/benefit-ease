import { Account } from "@repo/types";
import useSWR from "swr";

export function useAccounts() {
  const response = useSWR<Account[]>(
    "/rest/v1/accounts?select=id,balance,benefits(*)"
  );
  return {
    accounts: response.data || [],
    hasErrorAccounts: !!response.error,
    isLoadingAccounts: response.isLoading,
    ...response,
  };
}
