"use client";

import {
  ActionIcon,
  ActionIconProps,
  Avatar,
  Box,
  Container,
  Group,
  GroupProps,
  Menu,
  Stack,
  Text,
  TextProps,
  UnstyledButton,
  createPolymorphicComponent,
} from "@mantine/core";
import { forwardRef } from "react";
import { useCookies } from "react-cookie";

export const HeaderTitle = createPolymorphicComponent<"h1", TextProps>(
  forwardRef<HTMLHeadingElement, TextProps & { children: React.ReactNode }>(
    ({ children, ...rest }, ref) => (
      <Text component="h1" fw={600} size="xl" lh={1} {...rest} ref={ref}>
        {children}
      </Text>
    )
  )
);

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

export function HeaderGreetings() {
  const [cookies, , removeCookie] = useCookies([
    "access_token",
    "user",
    "refresh_token",
  ]);

  const displayName = cookies.user?.display_name;

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("user");
  };

  return (
    <Group gap={8}>
      <Menu width={100} position="bottom-start" offset={2} radius={8}>
        <Menu.Target>
          <Avatar
            color="orange"
            component={UnstyledButton}
            size="lg"
            variant="filled"
          >
            {displayName?.[0]}
          </Avatar>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component="a"
            href={`${process.env.NEXT_PUBLIC_WEB_URL}/profile`}
          >
            Perfil
          </Menu.Item>
          <Menu.Item onClick={handleLogout}>Sair</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Stack gap={4}>
        <Text lh={1}>{getGreeting()} 👋</Text>
        <HeaderTitle>{displayName}</HeaderTitle>
      </Stack>
    </Group>
  );
}

export const HeaderActionIcon = createPolymorphicComponent<
  "button",
  ActionIconProps
>(
  forwardRef<HTMLButtonElement, ActionIconProps>(
    ({ children, ...rest }, ref) => (
      <ActionIcon c="white" size="lg" variant="subtle" {...rest} ref={ref}>
        {children}
      </ActionIcon>
    )
  )
);

export function Header({ children, ...rest }: GroupProps) {
  return (
    <Box bg="red.8" c="white" component="header" h={90} {...rest}>
      <Container px={24} h="100%">
        <Group justify="space-between" h="100%">
          {children}
        </Group>
      </Container>
    </Box>
  );
}

Header.ActionIcon = HeaderActionIcon;
Header.Title = HeaderTitle;
Header.Greetings = HeaderGreetings;
