"use client";

import { supabase } from "@/lib/supabase";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

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

  const onSubmit: SubmitHandler<FormData> = ({ email, password }) => {
    supabase.auth.signUp({ email, password });
  };

  return (
    <Stack gap={32}>
      <Image src="/sign-up.svg" alt="" aria-hidden />

      <Title ta="center">Crie sua conta</Title>

      <Stack component="form" gap={24} onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            formNoValidate
            error={errors.email?.message}
            label="E-mail"
            placeholder="Seu e-mail profissional"
            size="md"
            type="email"
            {...register("email")}
          />
          <TextInput
            formNoValidate
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
    </Stack>
  );
}
