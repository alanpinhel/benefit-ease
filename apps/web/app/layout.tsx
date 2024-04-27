import "@mantine/carousel/styles.css";
import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { ClientOnlyCookiesProvider } from "@repo/components";
import { theme } from "@repo/constants";

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
          <Container maw={430} px={0} size="xs">
            <ClientOnlyCookiesProvider>{children}</ClientOnlyCookiesProvider>
          </Container>
        </MantineProvider>
      </body>
    </html>
  );
}
