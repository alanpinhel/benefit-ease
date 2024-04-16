"use client";

import { Anchor, Title } from "@mantine/core";
import { signOut, useAuth } from "./auth-context";
import { withAuth } from "./with-auth";

function HomePage(): JSX.Element {
  const [, authDispatch] = useAuth();

  return (
    <Title>
      Olá,{" "}
      <Anchor inherit onClick={() => signOut(authDispatch)}>
        sair
      </Anchor>
      .
    </Title>
  );
}

export default withAuth(HomePage);
