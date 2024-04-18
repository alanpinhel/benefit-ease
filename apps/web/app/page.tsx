"use client";

import { Anchor, Title } from "@mantine/core";
import { signOut, useAuth } from "./auth-context";
import { withAuth } from "./with-auth";

function HomePage(): JSX.Element {
  const [{ user }, authDispatch] = useAuth();

  return (
    <Title>
      Olá, {user?.display_name}.{" "}
      <Anchor inherit onClick={() => signOut(authDispatch)}>
        Sair
      </Anchor>
      ?
    </Title>
  );
}

export default withAuth(HomePage);
