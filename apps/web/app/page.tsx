"use client";

import { api } from "@/lib/api";
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  VisuallyHidden,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formatToBRL } from "brazilian-values";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
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

function HomePage(): JSX.Element {
  const [cookies, _, removeCookie] = useCookies(["access_token", "user"]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isHideValues, { toggle: toggleHideValues }] = useDisclosure(false);
  const computedColorScheme = useComputedColorScheme();
  const displayName = cookies.user?.display_name;

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get(
        "/rest/v1/accounts?select=id,balance,benefits(*)"
      );
      setAccounts(data);
    };
    fetch();
  }, []);

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("user");
  };

  return (
    <>
      <Group
        bg={computedColorScheme === "dark" ? "red.9" : "red.8"}
        component="header"
        h={84}
        justify="space-between"
        p={24}
        c="red.0"
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
        {accounts.map((account) => (
          <Fragment key={account.id}>
            <span>{account.benefits.icon}</span>
            <span>
              {isHideValues ? "🙈🙉🙊" : formatToBRL(account.balance)}
            </span>
            <span>{account.benefits.name}</span>
          </Fragment>
        ))}
      </Stack>
    </>
  );
}

export default withAuth(HomePage);
