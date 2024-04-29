"use client";

import { api } from "@/lib/api";
import {
  Alert,
  Container,
  Flex,
  Menu,
  MenuDropdown,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  VisuallyHidden,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  AccountAddCard,
  AccountCard,
  AccountSkeletonCard,
  Header,
  HeaderGreetings,
  withAuth,
} from "@repo/components";
import { useAccounts } from "@repo/hooks";
import { Benefit } from "@repo/types";
import { formatToBRL } from "brazilian-values";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";
import { useCookies } from "react-cookie";
import useSWRImmutable from "swr/immutable";

function useBenefits() {
  const response = useSWRImmutable<Benefit[]>("/rest/v1/benefits?select=*");
  return {
    benefits: response.data || [],
    hasErrorBenefits: !!response.error,
    isLoadingBenefits: response.isLoading,
  };
}

function useAddAccount() {
  const { accounts, mutate } = useAccounts();
  const [{ user }] = useCookies(["user"]);

  const addAccount = useCallback(
    async (benefit: Benefit) => {
      const accountsBackup = accounts;
      try {
        const uuid = crypto.randomUUID();
        const newAccounts = [
          ...accounts,
          { id: uuid, balance: 0, benefits: benefit },
        ];
        mutate(newAccounts, { revalidate: false });
        await api.post("/rest/v1/accounts", {
          id: uuid,
          user_id: user.id,
          balance: 0,
          benefit_id: benefit.id,
        });
        notifications.show({
          color: "green",
          message: "Conta adicionada com sucesso.",
          title: "Sucesso! 🎉",
        });
      } catch (error) {
        mutate(accountsBackup, { revalidate: false });
        notifications.show({
          color: "orange",
          message: "Ocorreu um erro ao adicionar a conta.",
          title: "Erro no servidor 😢",
        });
      }
    },
    [accounts]
  );

  return addAccount;
}

function HomePage(): JSX.Element {
  const { accounts, hasErrorAccounts, isLoadingAccounts } = useAccounts();
  const { benefits, hasErrorBenefits, isLoadingBenefits } = useBenefits();
  const addAccount = useAddAccount();
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const availableBenefits = useMemo(
    () => benefits.filter((b) => !accounts.some((a) => a.benefits.id === b.id)),
    [accounts, benefits]
  );

  useHotkeys([["A", () => addButtonRef.current?.click()]], []);

  return (
    <>
      <Header>
        <HeaderGreetings />
      </Header>
      <Container component="main" px={24} pt={32} pb={48}>
        <Stack align="flex-start">
          <Stack gap={0}>
            <Title order={2} fz={{ base: "h3", md: "h2" }}>
              Contas
            </Title>
            <Text fz={{ md: "lg" }} c="dimmed">
              Administre seus benefícios.
            </Text>
          </Stack>
          {hasErrorAccounts ? (
            <Alert radius="md" title="Erro no servidor 😢" variant="outline">
              Ocorreu um erro ao buscar as contas de benefício.
            </Alert>
          ) : isLoadingAccounts ? (
            <Flex gap={{ base: 8, xs: 16, md: 24 }} wrap="wrap">
              <VisuallyHidden>Carregando contas...</VisuallyHidden>
              {[...Array(3)].map((_, i) => (
                <AccountSkeletonCard key={i} />
              ))}
            </Flex>
          ) : (
            <SimpleGrid
              cols={{ base: 2, xs: 3, sm: 4, md: 6 }}
              spacing={{ base: 8, xs: 16, md: 24 }}
            >
              {accounts.map(({ balance, ...account }, index) => (
                <AccountCard
                  balance={formatToBRL(balance)}
                  component={Link}
                  data-testid={`account-${account.id}`}
                  from={account.benefits.color_from}
                  href={`/account/${account.id}`}
                  icon={account.benefits.icon}
                  key={index}
                  name={account.benefits.name}
                  to={account.benefits.color_to}
                />
              ))}
              {hasErrorBenefits ? (
                <Tooltip withArrow label="Adição indisponível">
                  <AccountAddCard disabled ref={addButtonRef} />
                </Tooltip>
              ) : isLoadingBenefits ? (
                <div>
                  <VisuallyHidden>Carregando benefícios...</VisuallyHidden>
                  <AccountSkeletonCard />
                </div>
              ) : availableBenefits.length > 0 ? (
                <Menu
                  width={180}
                  position="right-start"
                  offset={{ mainAxis: -124, alignmentAxis: 8 }}
                  radius={8}
                >
                  <Menu.Target>
                    <AccountAddCard ref={addButtonRef} />
                  </Menu.Target>
                  <MenuDropdown>
                    {availableBenefits.map((b, i) => (
                      <Menu.Item
                        key={b.id}
                        leftSection={b.icon}
                        onClick={() => addAccount(b)}
                      >
                        {b.name}
                      </Menu.Item>
                    ))}
                  </MenuDropdown>
                </Menu>
              ) : null}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default withAuth(HomePage);
