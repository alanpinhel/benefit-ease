"use client";

import { api } from "@/lib/api";
import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Group,
  Menu,
  Stack,
  Text,
  Title,
  UnstyledButton,
  VisuallyHidden,
  getGradient,
  rem,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formatToBRL } from "brazilian-values";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { withAuth } from "./with-auth";

export type Account = {
  id: string;
  balance: number;
  benefits: {
    id: string;
    name: string;
    color_from: string;
    color_to: string;
    icon: string;
  };
};

function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/rest/v1/accounts?select=id,balance,benefits(*)", {
        signal: controller.signal,
      })
      .then(({ data }) => setAccounts(data));
    return () => controller.abort();
  }, []);
  return accounts;
}

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

function HomePage(): JSX.Element {
  const [cookies, _, removeCookie] = useCookies([
    "access_token",
    "user",
    "refresh_token",
  ]);
  const [isHideValues, { toggle: toggleHideValues }] = useDisclosure(false);
  const computedColorScheme = useComputedColorScheme();
  const accounts = useAccounts();
  const theme = useMantineTheme();
  const displayName = cookies.user?.display_name;

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("user");
  };

  return (
    <>
      <Group
        bg={computedColorScheme === "dark" ? "red.9" : "red.8"}
        c="red.0"
        component="header"
        h={84}
        justify="space-between"
        p={24}
      >
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
      </Group>
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
          <Carousel
            slideGap={8}
            align="start"
            slideSize={100}
            withControls={false}
          >
            {accounts.map((account) => (
              <Carousel.Slide key={account.id}>
                <Card
                  withBorder
                  h={100}
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
                        {isHideValues ? "🙈🙉🙊" : formatToBRL(account.balance)}
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
        </Stack>
      </Stack>
    </>
  );
}

export default withAuth(HomePage);
