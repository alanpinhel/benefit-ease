"use client";

import { Carousel } from "@mantine/carousel";
import {
  Alert,
  Anchor,
  Flex,
  Group,
  Menu,
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
  TransactionItem,
  TransactionItemSkeleton,
  withAuth,
} from "@repo/components";
import { useAccounts, useTransactions } from "@repo/hooks";
import { IconEye, IconEyeOff, IconSubtask } from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import Link from "next/link";

function HomePage(): JSX.Element {
  const { accounts, hasErrorAccounts, isLoadingAccounts } = useAccounts();
  const { transactions, hasErrorTransactions, isLoadingTransactions } =
    useTransactions("&limit=5");
  const [isHideValues, { toggle: toggleHideValues }] = useDisclosure(false);

  return (
    <>
      <Header>
        <Header.Greetings>
          <Menu.Item
            component="a"
            href={"/admin"}
            leftSection={
              <IconSubtask
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.25}
              />
            }
          >
            Administração
          </Menu.Item>
        </Header.Greetings>
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
          {hasErrorAccounts ? (
            <Alert radius="md" title="Erro no servidor 😢" variant="outline">
              Ocorreu um erro ao buscar os benefícios.
            </Alert>
          ) : isLoadingAccounts ? (
            <Flex
              gap={{ base: 8, xs: 16, md: 24 }}
              mr={-24}
              style={{ overflow: "hidden" }}
              wrap="nowrap"
            >
              <VisuallyHidden>Carregando benefícios...</VisuallyHidden>
              {[...Array(3)].map((_, i) => (
                <AccountSkeletonCard key={i} />
              ))}
            </Flex>
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
          {hasErrorTransactions ? (
            <Alert radius="md" title="Erro no servidor 😢" variant="outline">
              Ocorreu um erro ao buscar as transações.
            </Alert>
          ) : isLoadingTransactions ? (
            <Stack>
              <VisuallyHidden>Carregando transações...</VisuallyHidden>
              {[...Array(5)].map((_, index) => (
                <TransactionItemSkeleton key={index} />
              ))}
            </Stack>
          ) : transactions.length === 0 ? (
            <Alert radius="md" variant="light" color="gray">
              Não há transações recentes.
            </Alert>
          ) : (
            <Stack>
              {transactions.map(({ amount, created_at, ...transaction }) => (
                <TransactionItem
                  key={transaction.id}
                  data-testid={`transaction-${transaction.id}`}
                  amount={isHideValues ? "🙈🙉🙊" : formatToBRL(amount)}
                  createdAt={formatToDateTime(new Date(created_at))}
                  icon={transaction.accounts.benefits.icon}
                  name={transaction.name}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default withAuth(HomePage);
