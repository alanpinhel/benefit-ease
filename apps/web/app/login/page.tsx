"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn, useAuth } from "../auth-context";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage(): JSX.Element {
  const [, authDispatch] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => signIn(authDispatch, data);

  return (
    <Stack gap={32}>
      <Image src="/login.svg" alt="" aria-hidden />

      <Title ta="center">Entre</Title>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={24}>
          <Stack>
            <TextInput
              required
              error={errors.email?.message}
              label="E-mail"
              placeholder="E-mail utilizado no cadastro"
              size="md"
              type="email"
              {...register("email")}
            />
            <TextInput
              required
              error={errors.password?.message}
              label="Senha"
              placeholder="Senha utilizada no cadastro"
              size="md"
              type="password"
              {...register("password")}
            />
          </Stack>

          <Button type="submit" size="md">
            Entrar
          </Button>

          <Text c="dimmed" ta="center">
            Ainda não tem uma conta?{" "}
            <Anchor component={Link} href="/sign-up">
              Cadastrar
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}
