"use client";

import { Card, Container, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Header, HeaderGreetings, withAuth } from "@repo/components";
import { accounts } from "@repo/mocks";
import { formatToBRL } from "brazilian-values";

function HomePage(): JSX.Element {
  return (
    <>
      <Header>
        <HeaderGreetings />
      </Header>
      <Container component="main" px={24} pt={38} pb={48}>
        <Stack gap={24}>
          <Stack gap={0}>
            <Title order={2} fz={{ base: "h3", md: "h2" }}>
              Contas
            </Title>
            <Text fz={{ md: "lg" }} c="dimmed">
              Administre seus benefícios.
            </Text>
          </Stack>
          <SimpleGrid
            cols={{ base: 2, xs: 3, sm: 4, md: 6 }}
            spacing={{ base: 8, xs: 16, md: 24 }}
          >
            {accounts.map((account, index) => (
              <Card key={index} data-testid={`account-${account.id}`}>
                <span>{account.benefits.icon}</span>
                <span>{formatToBRL(account.balance)}</span>
                <span>{account.benefits.name}</span>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default withAuth(HomePage);
