import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  RenderResult,
  render as testingLibraryRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./app/auth-context";
import { theme } from "./theme";

function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>
        <Notifications />
        <AuthProvider>{children}</AuthProvider>
      </MantineProvider>
    ),
  });
}

export * from "@testing-library/react";
export { render, userEvent };
