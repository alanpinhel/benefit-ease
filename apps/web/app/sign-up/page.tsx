"use client";

import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import Link from "next/link";
import { useReducer } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { withoutAuth } from "../without-auth";
import signUpImage from "./sign-up.svg";
import signedUpImage from "./signed-up.svg";

type Action = {
  type: "start sign up" | "finished sign up" | "fail sign up";
};

type State = { isSigningUp: boolean; isSignedUp: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start sign up": {
      return { ...state, isSigningUp: true };
    }
    case "finished sign up": {
      return { ...state, isSigningUp: false, isSignedUp: true };
    }
    case "fail sign up": {
      return { ...state, isSigningUp: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const schema = z.object({
  display_name: z.string().min(2, { message: "Mínimo de 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

function SignUpPage(): JSX.Element {
  const [{ isSignedUp, isSigningUp }, dispatch] = useReducer(reducer, {
    isSigningUp: false,
    isSignedUp: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      dispatch({ type: "start sign up" });
      await api.post("/auth/v1/signup", {
        email: data.email,
        password: data.password,
        data: { display_name: data.display_name },
      });
      dispatch({ type: "finished sign up" });
    } catch (error) {
      notifications.show({
        color: "orange",
        message: "Ocorreu um erro ao criar a conta.",
        title: "Erro no servidor 😢",
      });
      dispatch({ type: "fail sign up" });
    }
  };

  if (isSignedUp) {
    return (
      <Stack gap={0} pb={48} px={24}>
        <Image
          alt=""
          aria-hidden
          priority
          src={signedUpImage}
          style={{ marginInline: "auto", width: "90%", height: "auto" }}
        />
        <Stack gap={0} ta="center">
          <Title order={4}>Conta criada com sucesso 🎉</Title>
          <Text fz="md" c="dimmed">
            Confirme sua conta clicando no link enviado para o seu e-mail. Já
            confirmou?{" "}
            <Anchor component={Link} href="/login">
              Entrar
            </Anchor>
            .
          </Text>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack component="main" gap={32} pt={32} pb={48} px={24}>
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
              error={errors.display_name?.message}
              label="Nome"
              placeholder="Nome de preferência"
              size="md"
              type="text"
              {...register("display_name")}
            />
            <TextInput
              required
              error={errors.email?.message}
              label="E-mail"
              placeholder="Seu e-mail de fácil acesso"
              size="md"
              type="email"
              {...register("email")}
            />
            <PasswordInput
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
