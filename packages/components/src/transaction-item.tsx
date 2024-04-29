import {
  Center,
  Group,
  GroupProps,
  Skeleton,
  SkeletonProps,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import React from "react";

export function TransactionItemSkeleton(props: SkeletonProps) {
  return <Skeleton height={34} radius={8} width="100%" {...props} />;
}

type Props = {
  icon: React.ReactNode;
  name: React.ReactNode;
  amount: React.ReactNode;
  createdAt: React.ReactNode;
} & Omit<GroupProps, "children">;

export function TransactionItem({
  icon,
  name,
  amount,
  createdAt,
  ...rest
}: Props) {
  return (
    <Group justify="space-between" {...rest}>
      <Group gap={12}>
        <Center w={20} h={20}>
          <Text fz={20} lh={1}>
            {icon}
          </Text>
        </Center>
        <Stack gap={0}>
          <Text lh={rem(18)}>{name}</Text>
          <Text fz="sm" lh={rem(16)} c="dimmed">
            {createdAt}
          </Text>
        </Stack>
      </Group>
      <Text fw={600} lh={1}>
        {amount}
      </Text>
    </Group>
  );
}
