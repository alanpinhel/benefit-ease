"use client";

import { api } from "@/lib/api";
import {
  ActionIcon,
  Center,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconSearch,
} from "@tabler/icons-react";
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

function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

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
        <Group gap={8}>
          <TextInput
            aria-label="Pesquisar"
            leftSection={<IconSearch size={16} />}
            placeholder="Pesquisar"
            size="md"
            style={{ flex: 1 }}
            type="text"
            {...register("search")}
          />
          <Menu width={150} position="bottom-end" offset={2} radius={8}>
            <Menu.Target>
              <ActionIcon variant="default" size="input-md" radius="md">
                <IconCalendarEvent stroke={1} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component="label">
                Hoje
                <input hidden type="radio" value="0" {...register("period")} />
              </Menu.Item>
              <Menu.Item component="label">
                Ontem
                <input hidden type="radio" value="1" {...register("period")} />
              </Menu.Item>
              <Menu.Item component="label">
                7 dias
                <input hidden type="radio" value="7" {...register("period")} />
              </Menu.Item>
              <Menu.Item component="label">
                14 dias
                <input hidden type="radio" value="14" {...register("period")} />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Stack>
          {transactions
            .filter((t) =>
              new RegExp(escapeRegExp(watch("search")), "i").test(t.name)
            )
            .filter((t) => {
              if (!watch("period")) {
                return true;
              }
              return (
                new Date(t.created_at) >= subDays(new Date(), +watch("period"))
              );
            })
            .map((transaction) => (
              <Group
                key={transaction.id}
                data-testid={`transaction-${transaction.id}`}
                justify="space-between"
              >
                <Group gap={8}>
                  <Center w={24} h={24}>
                    <Text lh={1}>{transaction.accounts.benefits.icon}</Text>
                  </Center>
                  <Stack gap={0}>
                    <Text fz="xs">{transaction.name}</Text>
                    <Text fz="xs" c="dimmed">
                      {formatToDateTime(new Date(transaction.created_at))}
                    </Text>
                  </Stack>
                </Group>
                <Text fz="xs" fw={600}>
                  {formatToBRL(transaction.amount)}
                </Text>
              </Group>
            ))}
        </Stack>
      </Stack>
    </>
  );
}

export default withAuth(TransactionsPage);
