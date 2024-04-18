import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { theme } from "../theme";
import { ClientOnly } from "./client-only";

export const metadata = {
  title: "BenefitEase",
  description: "Gerencie seus benefícios de forma simples e eficiente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="pt-BR">
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <Notifications />
          <Container
            component="main"
            maw={430}
            pb={48}
            pt={32}
            px={24}
            size="xs"
          >
            <ClientOnly>{children}</ClientOnly>
          </Container>
        </MantineProvider>
      </body>
    </html>
  );
}
