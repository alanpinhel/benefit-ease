"use client";

import { api } from "@/lib/api";
import { Carousel } from "@mantine/carousel";
import {
  Anchor,
  Box,
  Card,
  Center,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  VisuallyHidden,
  getGradient,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header, withAuth } from "@repo/components";
import { Account, Transaction } from "@repo/types";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import Link from "next/link";
import { useEffect, useReducer } from "react";

type AccountsState = {
  accounts: Account[];
  isError: boolean;
  isLoading: boolean;
};

type AccountsAction =
  | { type: "start fetch accounts" }
  | { type: "fail fetch accounts" }
  | { type: "success fetch accounts"; accounts: Account[] };

function accountsReducer(state: AccountsState, action: AccountsAction) {
  switch (action.type) {
    case "start fetch accounts":
      return { ...state, isLoading: true };
    case "success fetch accounts":
      return {
        ...state,
        accounts: action.accounts,
        isLoading: false,
        isError: false,
      };
    case "fail fetch accounts":
      return { ...state, isLoading: false, isError: true };
    default:
      return state;
  }
}

type TransactionsState = {
  transactions: Transaction[];
  isError: boolean;
  isLoading: boolean;
};

type TransactionsAction =
  | { type: "start fetch transactions" }
  | { type: "fail fetch transactions" }
  | { type: "success fetch transactions"; transactions: Transaction[] };

function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction
) {
  switch (action.type) {
    case "start fetch transactions":
      return { ...state, isLoading: true };
    case "success fetch transactions":
      return {
        ...state,
        transactions: action.transactions,
        isLoading: false,
        isError: false,
      };
    case "fail fetch transactions":
      return { ...state, isLoading: false, isError: true };
    default:
      return state;
  }
}

function HomePage(): JSX.Element {
  const [accountsState, accountsDispatch] = useReducer(accountsReducer, {
    accounts: [],
    isError: false,
    isLoading: false,
  });
  const [transactionsState, transactionsDispatch] = useReducer(
    transactionsReducer,
    {
      transactions: [],
      isError: false,
      isLoading: false,
    }
  );
  const [isHideValues, { toggle: toggleHideValues }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    const controller = new AbortController();
    accountsDispatch({ type: "start fetch accounts" });
    api
      .get(`/rest/v1/accounts?select=id,balance,benefits(*)`, {
        signal: controller.signal,
      })
      .then(({ data: accounts }) => {
        accountsDispatch({ type: "success fetch accounts", accounts });
      })
      .catch(() => {
        accountsDispatch({ type: "fail fetch accounts" });
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    transactionsDispatch({ type: "start fetch transactions" });
    api
      .get(
        `/rest/v1/transactions?select=id,name,created_at,amount,accounts(benefits(icon))&limit=5&order=created_at.desc`,
        { signal: controller.signal }
      )
      .then(({ data: transactions }) => {
        transactionsDispatch({
          type: "success fetch transactions",
          transactions,
        });
      })
      .catch(() => {
        transactionsDispatch({ type: "fail fetch transactions" });
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Header>
        <Header.Greetings />
        <Header.ActionIcon onClick={toggleHideValues}>
          {isHideValues ? (
            <>
              <VisuallyHidden>Mostrar valores</VisuallyHidden>
              <IconEye stroke={1.25} />
            </>
          ) : (
            <>
              <VisuallyHidden>Esconder valores</VisuallyHidden>
              <IconEyeOff stroke={1.25} />
            </>
          )}
        </Header.ActionIcon>
      </Header>
      <Stack component="main" gap={32} pt={32} pb={48} px={24}>
        <Stack>
          <Stack gap={0}>
            <Title order={2} size="h4">
              Benefícios
            </Title>
            <Text fz="sm" c="dimmed">
              Seu saldo em tempo real.
            </Text>
          </Stack>
          {accountsState.isLoading ? (
            <Group gap={8} wrap="nowrap" style={{ overflow: "hidden" }}>
              <VisuallyHidden>Carregando benefícios...</VisuallyHidden>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  height={100}
                  key={index}
                  radius={12}
                  style={{ flexShrink: 0 }}
                  width={100}
                />
              ))}
            </Group>
          ) : accountsState.isError ? (
            <Text>Erro ao carregar benefícios.</Text>
          ) : (
            <Carousel
              dragFree
              align="start"
              containScroll="trimSnaps"
              draggable={accountsState.accounts.length > 2}
              mx={-24}
              slideGap={8}
              slideSize={100}
              withControls={false}
              styles={{
                container: {
                  marginLeft: rem(24),
                  marginRight: rem(16),
                },
              }}
            >
              {accountsState.accounts.map((account) => (
                <Carousel.Slide
                  key={account.id}
                  data-testid={`account-${account.id}`}
                >
                  <Card
                    withBorder
                    component={Link}
                    h={100}
                    href={`/transactions/?account_id=${account.id}`}
                    padding={8}
                    pos="relative"
                    radius={12}
                    w={100}
                  >
                    <Box
                      pos="absolute"
                      style={{ borderRadius: rem(4) }}
                      w={84}
                      h={30}
                      bg={getGradient(
                        {
                          from: account.benefits.color_from,
                          to: account.benefits.color_to,
                        },
                        theme
                      )}
                    />
                    <Stack gap={6} style={{ zIndex: 1 }}>
                      <Text fz={48} lh={1} ta="center">
                        {account.benefits.icon}
                      </Text>
                      <Stack gap={0}>
                        <Text fz="sm" fw={600} lh={rem(18)}>
                          {isHideValues
                            ? "🙈🙉🙊"
                            : formatToBRL(account.balance)}
                        </Text>
                        <Text fz={10} lh={rem(12)} fw={600} c="dimmed">
                          {account.benefits.name}
                        </Text>
                      </Stack>
                    </Stack>
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </Stack>
        <Stack>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2} size="h4">
                Transações
              </Title>
              <Text fz="sm" c="dimmed">
                Últimas 5 movimentações.
              </Text>
            </Stack>
            <Anchor component={Link} href="/transactions" fz="xs">
              Ver mais
            </Anchor>
          </Group>
          {transactionsState.isLoading ? (
            <Stack gap={8}>
              <VisuallyHidden>Carregando transações...</VisuallyHidden>
              {[...Array(5)].map((_, index) => (
                <Skeleton height={28} key={index} radius={4} width="100%" />
              ))}
            </Stack>
          ) : transactionsState.isError ? (
            <Text>Erro ao carregar transações.</Text>
          ) : (
            <Stack>
              {transactionsState.transactions.map((transaction) => (
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
                    {isHideValues ? "🙈🙉🙊" : formatToBRL(transaction.amount)}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default withAuth(HomePage);
