import {
  Box,
  Card,
  CardProps,
  MantineGradient,
  Skeleton,
  SkeletonProps,
  Stack,
  Text,
  createPolymorphicComponent,
  getGradient,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { forwardRef } from "react";

export function AccountSkeletonCard(props: SkeletonProps) {
  return (
    <Skeleton
      height={132}
      radius={12}
      style={{ flexShrink: 0 }}
      width={100}
      {...props}
    />
  );
}

type AccountCardProps = {
  balance: React.ReactNode;
  icon: React.ReactNode;
  name: React.ReactNode;
} & Omit<CardProps, "children"> &
  MantineGradient;

export const AccountCard = createPolymorphicComponent<"div", AccountCardProps>(
  forwardRef<HTMLDivElement, AccountCardProps>(
    ({ from, to, icon, balance, name, ...rest }, ref) => {
      const theme = useMantineTheme();
      return (
        <Card
          withBorder
          pos="relative"
          w={132}
          h={132}
          p={8}
          radius={12}
          {...rest}
          ref={ref}
        >
          <Box
            bg={getGradient({ from, to }, theme)}
            h={58}
            pos="absolute"
            style={{ borderRadius: rem(4) }}
            w={116}
          />
          <Stack gap={6} style={{ zIndex: 1 }}>
            <Text fz={72} lh={1} ta="center">
              {icon}
            </Text>
            <Stack gap={0}>
              <Text fz="lg" fw={600} lh={rem(20)}>
                {balance}
              </Text>
              <Text fz="sm" fw={600} lh={rem(16)} c="dimmed">
                {name}
              </Text>
            </Stack>
          </Stack>
        </Card>
      );
    }
  )
);
