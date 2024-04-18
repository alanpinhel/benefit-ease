"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { updateUser, useAuth } from "../auth-context";
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

function ProfilePage(): JSX.Element {
  const [{ isUpdatingUser, user }, authDispatch] = useAuth();
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
    updateUser(authDispatch, data);
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
              placeholder="Deixe em branco para manter a mesma."
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
