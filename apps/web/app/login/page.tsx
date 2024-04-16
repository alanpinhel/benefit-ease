"use client";

import { api } from "@/lib/api";
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
import { notifications } from "@mantine/notifications";
import axios from "axios";
import Link from "next/link";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Credentials = z.infer<typeof schema>;

function useSignIn() {
  const signIn = useCallback(async ({ email, password }: Credentials) => {
    try {
      await api.post("/auth/v1/token?grant_type=password", { email, password });
      notifications.show({
        color: "green",
        message: "Agora você já pode utilizar a plataforma.",
        title: "Boas-vindas de volta 🎉",
      });
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      switch (error.response?.status) {
        case 400:
          notifications.show({
            color: "red",
            message: "Credenciais inválidas.",
            title: "Erro de autenticação 😢",
          });
          break;

        default:
          notifications.show({
            color: "orange",
            message: "Ocorreu um erro ao criar a conta.",
            title: "Erro no servidor 😢",
          });
      }
    }
  }, []);

  return { signIn };
}

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

export default function LoginPage(): JSX.Element {
  const { signIn } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: zodResolver(schema),
  });

  return (
    <Stack gap={32}>
      <Image src="/login.svg" alt="" aria-hidden />

      <Title ta="center">Entre</Title>

      <form noValidate onSubmit={handleSubmit(signIn)}>
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
