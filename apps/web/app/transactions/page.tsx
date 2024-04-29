"use client";

import {
  ActionIcon,
  Center,
  Group,
  Indicator,
  Menu,
  MenuItemProps,
  Stack,
  Text,
  TextInput,
  VisuallyHidden,
  alpha,
  createPolymorphicComponent,
  useComputedColorScheme,
} from "@mantine/core";
import { Header, withAuth } from "@repo/components";
import { useTransactions } from "@repo/hooks";
import { Transaction } from "@repo/types";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconSearch,
} from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import { isAfter, isSameDay, subDays } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";

type MyMenuItemProps = MenuItemProps & {
  isActive: boolean;
};

const MenuItem = createPolymorphicComponent<"label", MyMenuItemProps>(
  forwardRef<HTMLLabelElement, MyMenuItemProps>(
    ({ children, isActive, ...rest }, ref) => {
      const colorScheme = useComputedColorScheme();
      const isDark = colorScheme === "dark";
      const red9 = "var(--mantine-color-red-9)";
      return (
        <Menu.Item
          component="label"
          bg={isActive ? (isDark ? alpha(red9, 0.45) : "red.0") : undefined}
          c={isActive ? (isDark ? "red.1" : "red.6") : undefined}
          {...rest}
          ref={ref}
        >
          {children}
        </Menu.Item>
      );
    }
  )
);

function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function isTransactionContainsSearch({ name }: Transaction, search: string) {
  if (!search) {
    return true;
  }
  return new RegExp(escapeRegExp(search), "i").test(name);
}

function isTransactionInPeriod({ created_at }: Transaction, period: string) {
  if (!period) {
    return true;
  }
  const limit = subDays(new Date(), +period);
  const createdAt = new Date(created_at);
  return isSameDay(createdAt, limit) || isAfter(createdAt, limit);
}

function isShowTransaction(
  transaction: Transaction,
  search: string,
  period: string
) {
  return (
    isTransactionContainsSearch(transaction, search) &&
    isTransactionInPeriod(transaction, period)
  );
}

const periods = [
  { label: "Hoje", value: "0" },
  { label: "Ontem", value: "1" },
  { label: "7 dias", value: "7" },
  { label: "14 dias", value: "14" },
];

type FormData = {
  search: string;
  period: string;
};

function TransactionsPage(): JSX.Element {
  const { register, watch } = useForm<FormData>();
  const params = useSearchParams();
  const accountId = params.get("account_id");
  const accountFilter = accountId ? `&account_id=eq.${accountId}` : "";
  const { transactions } = useTransactions(accountFilter);

  return (
    <>
      <Header>
        <Header.ActionIcon component={Link} href="/">
          <IconArrowLeft stroke={1.25} />
        </Header.ActionIcon>
        <Header.Title>Transações</Header.Title>
        <Header.ActionIcon style={{ visibility: "hidden" }} />
      </Header>
      <Stack component="main" pt={32} pb={48} px={24}>
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
              <Indicator offset={4} disabled={!watch("period")}>
                <ActionIcon variant="default" size="input-md" radius="md">
                  <VisuallyHidden>Período</VisuallyHidden>
                  <IconCalendarEvent stroke={1.25} />
                </ActionIcon>
              </Indicator>
            </Menu.Target>
            <Menu.Dropdown>
              {periods.map(({ label, value }) => (
                <MenuItem key={value} isActive={watch("period") === value}>
                  {label}
                  <input
                    hidden
                    type="radio"
                    value={watch("period") === value ? "" : value}
                    {...register("period")}
                  />
                </MenuItem>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Stack>
          {transactions.map(
            (t) =>
              isShowTransaction(t, watch("search"), watch("period")) && (
                <Group
                  key={t.id}
                  data-testid={`transaction-${t.id}`}
                  justify="space-between"
                >
                  <Group gap={8}>
                    <Center w={24} h={24}>
                      <Text lh={1}>{t.accounts.benefits.icon}</Text>
                    </Center>
                    <Stack gap={0}>
                      <Text fz="xs">{t.name}</Text>
                      <Text fz="xs" c="dimmed">
                        {formatToDateTime(new Date(t.created_at))}
                      </Text>
                    </Stack>
                  </Group>
                  <Text fz="xs" fw={600}>
                    {formatToBRL(t.amount)}
                  </Text>
                </Group>
              )
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default withAuth(TransactionsPage);
