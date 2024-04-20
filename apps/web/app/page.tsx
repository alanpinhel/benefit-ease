"use client";

import { api } from "@/lib/api";
import { Avatar, Group, Menu, Stack, Text } from "@mantine/core";
import { formatToBRL } from "brazilian-values";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { withAuth } from "./with-auth";

type Account = {
  id: string;
  balance: number;
  benefit: {
    id: string;
    name: string;
    color_from: string;
    color_to: string;
    icon: string;
  };
};

function HomePage(): JSX.Element {
  const [cookies, _, removeCookie] = useCookies(["access_token", "user"]);
  const displayName = cookies.user?.display_name;
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get("/rest/v1/accounts?select=*");
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
        bg="red.8"
        component="header"
        h={84}
        justify="space-between"
        p={24}
      >
        <Group gap={8}>
          <Menu>
            <Menu.Target data-testid="avatar-menu">
              <Avatar size={36} color="green" variant="filled">
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
              Bom dia 👋
            </Text>
            <Text fz="md" fw={600} c="red.0" lh={1}>
              {displayName}
            </Text>
          </Stack>
        </Group>
      </Group>
      <Stack component="main" gap={32} pt={32} pb={48} px={24}>
        {accounts.map((account) => (
          <Fragment key={account.id}>
            <span>{account.benefit.icon}</span>
            <span>{formatToBRL(account.balance)}</span>
            <span>{account.benefit.name}</span>
          </Fragment>
        ))}
      </Stack>
    </>
  );
}

export default withAuth(HomePage);
