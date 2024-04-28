"use client";

import { api } from "@/lib/api";
import {
  Container,
  Stack,
  Text,
  Title,
  VisuallyHidden,
  getGradient,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Header, withAuth } from "@repo/components";
import { useAccounts } from "@repo/hooks";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

function useDeleteAccount(id: number) {
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
  const { accounts, hasErrorLoadingAccount, isLoadingAccounts } = useAccounts();
  const { deleteAccount, isDeletingAccount } = useDeleteAccount(+id);
  const theme = useMantineTheme();
  const account = useMemo(() => accounts.find((a) => a.id === +id), [accounts]);

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

  if (hasErrorLoadingAccount) {
    return <>hasErrorLoadingAccount</>;
  }

  if (isLoadingAccounts) {
    return <>isLoadingAccounts</>;
  }

  if (!account) {
    return <>!account</>;
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
        <Stack align="flex-start">
          <Stack gap={0}>
            <Title order={2} fz={{ base: "h3", md: "h2" }}>
              Transações
            </Title>
            <Text fz={{ md: "lg" }} c="dimmed">
              Simule movimentações.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default withAuth(AccountPage);
