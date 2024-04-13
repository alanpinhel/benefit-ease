import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "../theme";

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
        <MantineProvider theme={theme}>
          <Container component="main" size="xs" pt={32} pb={48} px={24}>
            {children}
          </Container>
        </MantineProvider>
      </body>
    </html>
  );
}
