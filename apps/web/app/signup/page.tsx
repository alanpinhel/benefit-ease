import {
  Anchor,
  Button,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";

export default function SignUpPage(): JSX.Element {
  return (
    <Stack gap={32}>
      <Image src="/sign-up.svg" alt="" aria-hidden />
      <Title ta="center">Crie sua conta</Title>
      <Stack component="form" gap={24}>
        <Stack>
          <TextInput
            label="E-mail"
            placeholder="Seu e-mail profissional"
            required
            size="md"
          />
          <TextInput
            label="Senha"
            placeholder="Crie uma nova senha"
            required
            size="md"
          />
        </Stack>

        <Button type="submit" size="md">
          Criar conta
        </Button>

        <Text c="dimmed" ta="center">
          Já tem uma conta?{" "}
          <Anchor component={Link} href="/login">
            Entrar
          </Anchor>
        </Text>
      </Stack>
    </Stack>
  );
}
