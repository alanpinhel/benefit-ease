"use client";

import {
  Alert,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  VisuallyHidden,
} from "@mantine/core";
import {
  AccountCard,
  AccountCardSkeleton,
  Header,
  HeaderGreetings,
  withAuth,
} from "@repo/components";
import { useAccounts } from "@repo/hooks";
import { formatToBRL } from "brazilian-values";

function HomePage(): JSX.Element {
  const { accounts, isLoadingAccounts, hasAccountError } = useAccounts();
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
          {hasAccountError ? (
            <Alert radius="md" title="Erro no servidor 😢" variant="outline">
              Ocorreu um erro ao buscar as contas de benefício.
            </Alert>
          ) : isLoadingAccounts ? (
            <Group gap={8} wrap="nowrap" style={{ overflow: "hidden" }}>
              <VisuallyHidden>Carregando contas...</VisuallyHidden>
              {[...Array(3)].map((_, i) => (
                <AccountCardSkeleton key={i} />
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
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default withAuth(HomePage);
