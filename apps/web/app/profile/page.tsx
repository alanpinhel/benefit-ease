"use client";

import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Header, withAuth } from "@repo/components";
import { IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  display_name: z.string().min(2, { message: "Mínimo de 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(6, { message: "Mínimo de 6 caracteres." })
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

function ProfilePage(): JSX.Element {
  const [cookies, setCookie] = useCookies(["user"]);
  const [isUpdatingUser, setUpdatingUser] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: cookies.user?.display_name,
      email: cookies.user?.email,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ password, ...user }) => {
    try {
      setUpdatingUser(true);
      await api.put("/auth/v1/user", {
        email: user.email,
        password: password || undefined,
        data: {
          display_name: user.display_name,
        },
      });
      setCookie("user", user);
      notifications.show({
        color: "green",
        message: "Usuário atualizado com sucesso.",
        title: "Sucesso 🎉",
      });
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
  };

  return (
    <>
      <Header>
        <Header.ActionIcon component={Link} href="/">
          <IconArrowLeft stroke={1.25} />
        </Header.ActionIcon>
        <Header.Title>Editar conta</Header.Title>
        <Header.ActionIcon style={{ visibility: "hidden" }} />
      </Header>
      <Stack component="main" gap={32} pt={32} pb={48} px={24}>
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
    </>
  );
}

export default withAuth(ProfilePage);
