"use client";

import { Title } from "@mantine/core";
import { withAuth } from "./with-auth";

function HomePage(): JSX.Element {
  return <Title>Home</Title>;
}

export default withAuth(HomePage);
