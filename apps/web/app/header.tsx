import { Group, useComputedColorScheme } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export function Header({ children }: Props) {
  const computedColorScheme = useComputedColorScheme();

  return (
    <Group
      bg={computedColorScheme === "dark" ? "red.9" : "red.8"}
      c="red.0"
      component="header"
      h={84}
      justify="space-between"
      p={24}
    >
      {children}
    </Group>
  );
}
