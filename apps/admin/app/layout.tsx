"use client";

import { api } from "@/lib/api";
import "@mantine/carousel/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { theme } from "@repo/constants";
import { CookiesProvider } from "react-cookie";
import { SWRConfig } from "swr";

const defaultSetOptions = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

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
          <ModalsProvider>
            <Notifications />
            <CookiesProvider defaultSetOptions={defaultSetOptions}>
              <SWRConfig value={{ fetcher, errorRetryCount: 3 }}>
                {children}
              </SWRConfig>
            </CookiesProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
