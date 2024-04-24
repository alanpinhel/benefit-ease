"use client";

import { api } from "@/lib/api";
import {
  ActionIcon,
  Radio,
  RadioGroup,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import { subDays } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../header";
import { Transaction } from "../page";
import { withAuth } from "../with-auth";

type FormData = {
  search: string;
  period: string;
};

function TransactionsPage(): JSX.Element {
  const { register, watch } = useForm<FormData>();
  const params = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const accountId = params.get("account_id");
  const accountFilter = accountId ? `&account_id=eq.${accountId}` : "";

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(
        `/rest/v1/transactions?select=id,name,created_at,amount,accounts(benefits(icon))&order=created_at.desc${accountFilter}`,
        {
          signal: controller.signal,
        }
      )
      .then(({ data: transactions }) => {
        setTransactions(transactions);
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Header>
        <ActionIcon
          c="red.0"
          component={Link}
          href="/"
          size="md"
          variant="transparent"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Text ta="center" fz="md" fw={600}>
          Transações
        </Text>
        <ActionIcon style={{ visibility: "hidden" }} size="md" />
      </Header>
      <Stack component="main" gap={32} pt={32} pb={48} px={24}>
        <TextInput
          aria-label="Pesquisar"
          leftSection={<IconSearch size={16} />}
          placeholder="Pesquisar"
          size="md"
          type="text"
          {...register("search")}
        />
        <RadioGroup>
          <Radio {...register("period")} value="0" label="Hoje" />
          <Radio {...register("period")} value="1" label="Ontem" />
          <Radio {...register("period")} value="7" label="7 dias" />
          <Radio {...register("period")} value="14" label="14 dias" />
        </RadioGroup>
        {transactions
          .filter((t) => new RegExp(watch("search"), "i").test(t.name))
          .filter((t) => {
            if (!watch("period")) {
              return true;
            }
            return (
              new Date(t.created_at) >= subDays(new Date(), +watch("period"))
            );
          })
          .map((transaction) => (
            <Stack
              key={transaction.id}
              data-testid={`transaction-${transaction.id}`}
            >
              <span>{transaction.name}</span>
              <span>{formatToDateTime(new Date(transaction.created_at))}</span>
              <span>{formatToBRL(transaction.amount)}</span>
            </Stack>
          ))}
      </Stack>
    </>
  );
}

export default withAuth(TransactionsPage);
