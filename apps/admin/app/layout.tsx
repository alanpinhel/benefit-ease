import "@mantine/carousel/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ClientOnlyCookiesProvider } from "@repo/components";
import { theme } from "../theme";

export const metadata = {
  title: "BenefitEaseAdmin",
  description: "Administração dos benefícios de forma simples e eficiente.",
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
          <ClientOnlyCookiesProvider>{children}</ClientOnlyCookiesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
