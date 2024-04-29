"use client";

import { api } from "@/lib/api";
import {
  Alert,
  Container,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  VisuallyHidden,
  getGradient,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  Header,
  TransactionItem,
  TransactionItemSkeleton,
  withAuth,
} from "@repo/components";
import { useAccounts, useTransactions } from "@repo/hooks";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { formatToBRL, formatToDateTime } from "brazilian-values";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

function useDeleteAccount(id: string) {
  const [isDeletingAccount, setDeletingAccount] = useState(false);
  const { accounts, mutate } = useAccounts();
  const router = useRouter();

  const deleteAccount = useCallback(async () => {
    try {
      setDeletingAccount(true);
      await api.delete(`/rest/v1/accounts?id=eq.${id}`);
      await mutate(accounts.filter((account) => account.id !== id));
      router.push("/");
      notifications.show({
        color: "green",
        message: "As transações relacionadas à conta foram excluídas.",
        title: "Conta excluída com sucesso ✅",
      });
    } catch (error) {
      notifications.show({
        color: "orange",
        message: "Ocorreu um erro ao excluir a conta.",
        title: "Erro no servidor 😢",
      });
    } finally {
      setDeletingAccount(false);
    }
  }, [accounts]);

  return {
    deleteAccount,
    isDeletingAccount,
  };
}

function AccountPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { accounts, isLoadingAccounts } = useAccounts();
  const { deleteAccount, isDeletingAccount } = useDeleteAccount(id);
  const theme = useMantineTheme();
  const account = useMemo(() => accounts.find((a) => a.id === id), [accounts]);
  const { transactions, hasErrorTransactions, isLoadingTransactions } =
    useTransactions(`&account_id=eq.${id}`);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Exclua a conta de benefício",
      children: (
        <Text size="sm">
          Tem certeza de que deseja excluir a conta de benefício? Está ação é
          irreversível e removerá também as transações relacionadas.
        </Text>
      ),
      labels: { confirm: "Deletar conta", cancel: "Não, não exclua" },
      onConfirm: deleteAccount,
    });

  if (isLoadingAccounts) {
    return (
      <Header bg="transparent">
        <VisuallyHidden>Carregando conta...</VisuallyHidden>
        <Header.ActionIcon component={Link} href="/">
          <IconArrowLeft stroke={1.25} />
        </Header.ActionIcon>
        <Skeleton height={24} width={160} radius="sm" />
        <Header.ActionIcon style={{ visibility: "hidden" }} />
      </Header>
    );
  }

  if (!account) {
    return (
      <Header>
        <Header.ActionIcon component={Link} href="/">
          <IconArrowLeft stroke={1.25} />
        </Header.ActionIcon>
        <Header.Title>Conta não encontrada</Header.Title>
        <Header.ActionIcon style={{ visibility: "hidden" }} />
      </Header>
    );
  }

  const {
    benefits: { color_from, color_to, name },
  } = account;

  return (
    <>
      <Header bg={getGradient({ from: color_from, to: color_to }, theme)}>
        <Header.ActionIcon component={Link} href="/">
          <IconArrowLeft stroke={1.25} />
        </Header.ActionIcon>
        <Header.Title>{name}</Header.Title>
        <Header.ActionIcon
          onClick={openDeleteModal}
          loading={isDeletingAccount}
        >
          <VisuallyHidden>Excluir conta</VisuallyHidden>
          <IconTrash stroke={1.25} />
        </Header.ActionIcon>
      </Header>
      <Container component="main" px={24} pt={32} pb={48}>
        <Stack>
          <Stack gap={0}>
            <Title order={2} fz={{ base: "h3", md: "h2" }}>
              Transações
            </Title>
            <Text fz={{ md: "lg" }} c="dimmed">
              Simule movimentações.
            </Text>
          </Stack>
          {hasErrorTransactions ? (
            <Alert radius="md" title="Erro no servidor 😢" variant="outline">
              Ocorreu um erro ao buscar as transações.
            </Alert>
          ) : isLoadingTransactions ? (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 16, sm: 24, md: 32 }}
            >
              <VisuallyHidden>Carregando transações...</VisuallyHidden>
              {[...Array(5)].map((_, index) => (
                <TransactionItemSkeleton key={index} />
              ))}
            </SimpleGrid>
          ) : transactions.length === 0 ? (
            <Alert radius="md" variant="light" color="gray">
              Não há transações recentes.
            </Alert>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 16, sm: 24, md: 32 }}
            >
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  data-testid={`transaction-${transaction.id}`}
                  amount={formatToBRL(transaction.amount)}
                  createdAt={formatToDateTime(new Date(transaction.created_at))}
                  icon={transaction.accounts.benefits.icon}
                  name={transaction.name}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default withAuth(AccountPage);
