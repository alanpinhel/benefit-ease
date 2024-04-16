"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Stack, Text, TextInput, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signIn, useAuth } from "../auth-context";
import { withoutAuth } from "../without-auth";
import loginImage from "./login.svg";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

function LoginPage() {
  const [{ isSigningIn }, authDispatch] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    signIn(authDispatch, data);
  };

  return (
    <Stack gap={32}>
      <Image
        aria-hidden
        alt=""
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
