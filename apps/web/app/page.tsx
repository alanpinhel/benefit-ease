"use client";

import { api } from "@/lib/api";
import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Center,
  Group,
  Menu,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
  VisuallyHidden,
  getGradient,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import Link from "next/link";
import { useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import { Header } from "./header";
import { withAuth } from "./with-auth";

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours >= 6 && hours < 12) {
    return "Bom dia";
  }
  if (hours >= 12 && hours < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
};

export type Account = {
  id: number;
  balance: number;
  benefits: {
    id: number;
    name: string;
    color_from: string;
    color_to: string;
    icon: string;
  };
};

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

export type Transaction = {
  id: number;
  amount: number;
  name: string;
  created_at: string;
  accounts: {
    benefits: {
      icon: string;
    };
  };
};

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
  const [cookies, _, removeCookie] = useCookies([
    "access_token",
    "user",
    "refresh_token",
  ]);
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

  const displayName = cookies.user?.display_name;

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("user");
  };

  return (
    <>
      <Header>
        <Group gap={8}>
          <Menu width={100} position="bottom-start" offset={2} radius={8}>
            <Menu.Target>
              <Avatar
                color="green"
                component={UnstyledButton}
                size={36}
                variant="filled"
              >
                {displayName?.[0]}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} href="/profile">
                Perfil
              </Menu.Item>
              <Menu.Item onClick={handleLogout}>Sair</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Stack gap={4}>
            <Text fz="sm" c="red.1" lh={1}>
              {getGreeting()} 👋
            </Text>
            <Text fz="md" fw={600} c="red.0" lh={1}>
              {displayName}
            </Text>
          </Stack>
        </Group>
        <ActionIcon
          c="red.1"
          component="button"
          onClick={toggleHideValues}
          size="md"
          variant="subtle"
        >
          {isHideValues ? (
            <>
              <VisuallyHidden>Mostrar valores</VisuallyHidden>
              <IconEye style={{ width: "70%", height: "70%" }} />
            </>
          ) : (
            <>
              <VisuallyHidden>Esconder valores</VisuallyHidden>
              <IconEyeOff style={{ width: "70%", height: "70%" }} />
            </>
          )}
        </ActionIcon>
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
          <Stack gap={0}>
            <Title order={2} size="h4">
              Transações
            </Title>
            <Text fz="sm" c="dimmed">
              Últimas movimentações.
            </Text>
          </Stack>
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
