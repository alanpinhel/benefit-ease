"use client";

import { Avatar, Group, Stack, Text } from "@mantine/core";
import { useCookies } from "react-cookie";
import { withAuth } from "./with-auth";

function HomePage(): JSX.Element {
  const [cookies, _, removeCookie] = useCookies(["access_token", "user"]);
  const displayName = cookies.user?.display_name;

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
          <Avatar size={36} color="green" variant="filled">
            {displayName?.[0]}
          </Avatar>
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
      <Stack component="main" gap={32} pt={32} pb={48} px={24}></Stack>
    </>
  );
}

export default withAuth(HomePage);
