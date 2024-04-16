"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Stack, Text, TextInput, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signUp, useAuth } from "../auth-context";
import { withoutAuth } from "../without-auth";
import signUpImage from "./sign-up.svg";
import signedUpImage from "./signed-up.svg";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

function SignUpPage(): JSX.Element {
  const [{ isSigningUp, isSignedUp }, authDispatch] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    signUp(authDispatch, data);
  };

  if (isSignedUp) {
    return (
      <Stack gap={0}>
        <Image
          aria-hidden
          alt=""
          src={signedUpImage}
          style={{ marginInline: "auto", width: "90%", height: "auto" }}
        />
        <Stack>
          <Title ta="center" order={4}>
            Conta criada com sucesso 🎉
          </Title>
          <Text fz="md" ta="center">
            Confirme sua conta clicando no link enviado para o seu e-mail.
          </Text>
        </Stack>
      </Stack>
    );
  }

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

          <Button type="submit" size="md" loading={isSigningUp}>
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

export default withoutAuth(SignUpPage);
