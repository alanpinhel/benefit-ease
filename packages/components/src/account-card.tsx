import {
  ActionIcon,
  ActionIconProps,
  Box,
  Card,
  CardProps,
  Kbd,
  MantineGradient,
  Skeleton,
  SkeletonProps,
  Stack,
  Text,
  VisuallyHidden,
  createPolymorphicComponent,
  getGradient,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconCategoryPlus } from "@tabler/icons-react";
import { forwardRef } from "react";

export function AccountSkeletonCard(props: SkeletonProps) {
  return (
    <Skeleton
      height={132}
      radius={12}
      style={{ flexShrink: 0 }}
      width={132}
      {...props}
    />
  );
}

export const AccountAddCard = createPolymorphicComponent<
  "button",
  ActionIconProps
>(
  forwardRef<HTMLButtonElement, ActionIconProps>((props, ref) => {
    return (
      <ActionIcon
        variant="default"
        h={132}
        p={8}
        pos="relative"
        radius={12}
        w={132}
        {...props}
        ref={ref}
      >
        <VisuallyHidden>Adicionar conta</VisuallyHidden>
        <IconCategoryPlus
          stroke={1.25}
          style={{ width: rem(48), height: rem(48) }}
        />
        <Kbd pos="absolute" right={8} bottom={8}>
          A
        </Kbd>
      </ActionIcon>
    );
  })
);

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
