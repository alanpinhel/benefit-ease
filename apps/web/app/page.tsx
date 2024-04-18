"use client";

import { Anchor, Title } from "@mantine/core";
import { useCookies } from "react-cookie";
import { withAuth } from "./with-auth";

function HomePage(): JSX.Element {
  const [cookies, _, removeCookie] = useCookies(["access_token", "user"]);

  return (
    <Title>
      Olá, {cookies.user?.display_name}.{" "}
      <Anchor
        inherit
        onClick={() => {
          removeCookie("access_token");
          removeCookie("user");
        }}
      >
        Sair
      </Anchor>
      ?
    </Title>
  );
}

export default withAuth(HomePage);
