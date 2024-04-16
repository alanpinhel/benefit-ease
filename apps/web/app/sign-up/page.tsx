"use client";

import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Stack, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import signUpImage from "./sign-up.svg";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

export default function SignUpPage(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      await api.post("/auth/v1/signup", { email, password });
      notifications.show({
        color: "green",
        message: `Confirme sua conta clicando no link enviado para o seu e-mail.`,
        title: "Conta criada com sucesso 🎉",
      });
    } catch (error) {
      notifications.show({
        color: "orange",
        message: "Ocorreu um erro ao criar a conta.",
        title: "Erro no servidor 😢",
      });
    }
  };

  return (
    <Stack gap={32}>
      <Image
        aria-hidden
        alt=""
        src={signUpImage}
        style={{ marginInline: "auto", width: "90%", height: "auto" }}
      />

      <Title ta="center">Crie sua conta</Title>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={24}>
          <Stack>
            <TextInput
              required
              error={errors.email?.message}
              label="E-mail"
              placeholder="Seu melhor e-mail"
              size="md"
              type="email"
              {...register("email")}
            />
            <TextInput
              required
              error={errors.password?.message}
              label="Senha"
              placeholder="Crie uma nova senha"
              size="md"
              type="password"
              {...register("password")}
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
      </form>
    </Stack>
  );
}
