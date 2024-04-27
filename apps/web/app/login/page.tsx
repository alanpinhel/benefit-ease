"use client";

import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Stack, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { withoutAuth } from "../without-auth";
import loginImage from "./login.svg";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

export type SignInResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    email: string;
    user_metadata: {
      display_name: string;
    };
  };
};

function LoginPage() {
  const [isSigningIn, setSigningIn] = useState(false);
  const [, setCookie] = useCookies(["user", "access_token", "refresh_token"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      setSigningIn(true);
      const { data } = await api.post<SignInResponse>(
        "/auth/v1/token?grant_type=password",
        form
      );
      setCookie("user", {
        email: data.user.email,
        display_name: data.user.user_metadata.display_name,
      });
      setCookie("access_token", data.access_token);
      setCookie("refresh_token", data.refresh_token);
      api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
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
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <Stack component="main" gap={32} pt={32} pb={48} px={24}>
      <Image
        alt=""
        aria-hidden
        src={loginImage}
        style={{ marginInline: "auto", width: "90%", height: "auto" }}
      />
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

          <Button type="submit" size="md" loading={isSigningIn}>
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

export default withoutAuth(LoginPage);
