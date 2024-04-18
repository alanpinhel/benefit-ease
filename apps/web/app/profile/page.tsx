"use client";

import { api } from "@/lib/api";
import { cookies } from "@/lib/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { AuthDispatch, useAuth } from "../auth-context";
import { withAuth } from "../with-auth";

const schema = z.object({
  display_name: z.string().min(2, { message: "Mínimo de 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "Mínimo de 6 caracteres." })
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

type Dispatch = (isUpdatingUser: boolean) => void;

async function updateUser(
  authDispatch: AuthDispatch,
  setUpdatingUser: Dispatch,
  user: FormData
) {
  try {
    setUpdatingUser(true);
    await api.put("/auth/v1/user", {
      email: user.email,
      password: user.password || undefined,
      data: {
        display_name: user.display_name,
      },
    });
    notifications.show({
      color: "green",
      message: "Usuário atualizado com sucesso.",
      title: "Sucesso 🎉",
    });
    cookies.set("user", user);
    authDispatch({ type: "update user", user });
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    notifications.show({
      color: "orange",
      message: "Ocorreu um erro ao atualizar o usuário.",
      title: "Erro no servidor 😢",
    });
  } finally {
    setUpdatingUser(false);
  }
}

function ProfilePage(): JSX.Element {
  const [{ user }, authDispatch] = useAuth();
  const [isUpdatingUser, setUpdatingUser] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: user?.display_name,
      email: user?.email,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateUser(authDispatch, setUpdatingUser, data);
  };

  return (
    <Stack gap={32}>
      <Title ta="center">Editar conta</Title>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={24}>
          <Stack>
            <TextInput
              required
              error={errors.display_name?.message}
              label="Nome"
              size="md"
              type="text"
              {...register("display_name")}
            />
            <TextInput
              required
              error={errors.email?.message}
              label="E-mail"
              size="md"
              type="email"
              {...register("email")}
            />
            <PasswordInput
              error={errors.password?.message}
              label="Senha"
              placeholder="••••••"
              size="md"
              type="password"
              {...register("password")}
            />
          </Stack>
          <Button type="submit" size="md" loading={isUpdatingUser}>
            Salvar
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default withAuth(ProfilePage);
