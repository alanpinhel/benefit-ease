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
  alpha,
  useComputedColorScheme,
} from "@mantine/core";
import { Header, withAuth } from "@repo/components";
import { Transaction } from "@repo/types";
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
  const colorScheme = useComputedColorScheme();

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
        <Header.ActionIcon component={Link} href="/">
          <IconArrowLeft stroke={1.25} />
        </Header.ActionIcon>
        <Header.Title>Transações</Header.Title>
        <Header.ActionIcon style={{ visibility: "hidden" }} />
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
                <IconCalendarEvent />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {[
                { label: "Hoje", value: "0" },
                { label: "Ontem", value: "1" },
                { label: "7 dias", value: "7" },
                { label: "14 dias", value: "14" },
              ].map(({ label, value }) => (
                <Menu.Item
                  key={value}
                  component="label"
                  bg={
                    watch("period") === value
                      ? colorScheme === "dark"
                        ? alpha("var(--mantine-color-red-9)", 0.45)
                        : "red.0"
                      : undefined
                  }
                  c={
                    watch("period") === value
                      ? colorScheme === "dark"
                        ? "red.1"
                        : "red.6"
                      : undefined
                  }
                >
                  {label}
                  <input
                    hidden
                    type="radio"
                    value={watch("period") === value ? "" : value}
                    {...register("period")}
                  />
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Stack>
          {transactions
            .filter(({ name }) =>
              new RegExp(escapeRegExp(watch("search")), "i").test(name)
            )
            .filter(({ created_at }) => {
              if (!watch("period")) {
                return true;
              }
              return (
                new Date(created_at) >= subDays(new Date(), +watch("period"))
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
