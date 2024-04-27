"use client";

import { Header, HeaderGreetings, withAuth } from "@repo/components";

function HomePage(): JSX.Element {
  return (
    <>
      <Header>
        <HeaderGreetings />
      </Header>
    </>
  );
}

export default withAuth(HomePage);
