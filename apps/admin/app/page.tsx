"use client";

import {
  Alert,
  Container,
  Group,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  VisuallyHidden,
} from "@mantine/core";
import {
  AccountCard,
  AccountSkeletonCard,
  Header,
  HeaderGreetings,
  withAuth,
} from "@repo/components";
import { useAccounts } from "@repo/hooks";
import { formatToBRL } from "brazilian-values";
import { useMemo } from "react";
import useSWRImmutable from "swr/immutable";

export type Benefit = {
  id: number;
  name: string;
  icon: string;
};

function useBenefits() {
  const response = useSWRImmutable<Benefit[]>(
    "/rest/v1/benefits?select=id,name,icon"
  );
  return {
    benefits: response.data || [],
    hasErrorBenefits: !!response.error,
    isLoadingBenefits: response.isLoading,
  };
}

function HomePage(): JSX.Element {
  const { accounts, hasErrorAccounts, isLoadingAccounts } = useAccounts();
  const { benefits, hasErrorBenefits, isLoadingBenefits } = useBenefits();

  const availableBenefits = useMemo(
    () => benefits.filter((b) => !accounts.some((a) => a.benefits.id === b.id)),
    [accounts, benefits]
  );

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
            <Group gap={8} wrap="nowrap" style={{ overflow: "hidden" }}>
              <VisuallyHidden>Carregando contas...</VisuallyHidden>
              {[...Array(3)].map((_, i) => (
                <AccountSkeletonCard key={i} />
              ))}
            </Group>
          ) : (
            <SimpleGrid
              cols={{ base: 2, xs: 3, sm: 4, md: 6 }}
              spacing={{ base: 8, xs: 16, md: 24 }}
            >
              {accounts.map(({ balance, ...account }, index) => (
                <AccountCard
                  key={index}
                  data-testid={`account-${account.id}`}
                  from={account.benefits.color_from}
                  to={account.benefits.color_to}
                  icon={account.benefits.icon}
                  name={account.benefits.name}
                  balance={formatToBRL(balance)}
                />
              ))}
              {hasErrorBenefits ? (
                <Tooltip withArrow label="Adição indisponível">
                  <button disabled>Adicionar conta</button>
                </Tooltip>
              ) : isLoadingBenefits ? (
                <div>
                  <VisuallyHidden>Carregando benefícios...</VisuallyHidden>
                  <AccountSkeletonCard />
                </div>
              ) : availableBenefits.length > 0 ? (
                <Menu>
                  <Menu.Target>
                    <button>Adicionar conta</button>
                  </Menu.Target>
                  {availableBenefits.map((b) => (
                    <Menu.Item key={0}>{`${b.icon} ${b.name}`}</Menu.Item>
                  ))}
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
