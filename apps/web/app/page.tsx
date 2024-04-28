"use client";

import { api } from "@/lib/api";
import { Carousel } from "@mantine/carousel";
import {
  Alert,
  Anchor,
  Center,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  VisuallyHidden,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  AccountCard,
  AccountSkeletonCard,
  Header,
  withAuth,
} from "@repo/components";
import { useAccounts } from "@repo/hooks";
import { Transaction } from "@repo/types";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import Link from "next/link";
import { useEffect, useReducer } from "react";

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
  const { accounts, isLoadingAccounts, hasErrorLoadingAccount } = useAccounts();
  const [transactionsState, transactionsDispatch] = useReducer(
    transactionsReducer,
    {
      transactions: [],
      isError: false,
      isLoading: false,
    }
  );
  const [isHideValues, { toggle: toggleHideValues }] = useDisclosure(false);

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
            <Title order={2} fz={{ base: "h3", md: "h2" }}>
              Benefícios
            </Title>
            <Text fz={{ md: "lg" }} c="dimmed">
              Seu saldo em tempo real.
            </Text>
          </Stack>
          {hasErrorLoadingAccount ? (
            <Alert radius="md" title="Erro no servidor 😢" variant="outline">
              Ocorreu um erro ao buscar os benefícios.
            </Alert>
          ) : isLoadingAccounts ? (
            <Group
              gap={8}
              mr={-24}
              style={{ overflow: "hidden" }}
              wrap="nowrap"
            >
              <VisuallyHidden>Carregando benefícios...</VisuallyHidden>
              {[...Array(3)].map((_, i) => (
                <AccountSkeletonCard key={i} />
              ))}
            </Group>
          ) : accounts.length === 0 ? (
            <Alert radius="md" variant="light" color="gray">
              Você ainda não possui benefícios cadastrados.
            </Alert>
          ) : (
            <Carousel
              dragFree
              align="start"
              containScroll="trimSnaps"
              draggable={accounts.length > 2}
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
              {accounts.map(({ balance, ...account }) => (
                <Carousel.Slide
                  key={account.id}
                  data-testid={`account-${account.id}`}
                >
                  <AccountCard
                    component={Link}
                    href={`/transactions/?account_id=${account.id}`}
                    from={account.benefits.color_from}
                    to={account.benefits.color_to}
                    icon={account.benefits.icon}
                    balance={isHideValues ? "🙈🙉🙊" : formatToBRL(balance)}
                    name={account.benefits.name}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </Stack>
        <Stack>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2} fz={{ base: "h3", md: "h2" }}>
                Transações
              </Title>
              <Text fz={{ md: "lg" }} c="dimmed">
                Últimas movimentações.
              </Text>
            </Stack>
            <Anchor component={Link} href="/transactions" fz="sm">
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
          ) : transactionsState.transactions.length === 0 ? (
            <Alert radius="md" variant="light" color="gray">
              Não há transações recentes.
            </Alert>
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
