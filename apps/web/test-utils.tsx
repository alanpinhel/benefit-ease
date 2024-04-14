import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  RenderResult,
  render as testingLibraryRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { theme } from "./theme";

function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    ),
  });
}

export * from "@testing-library/react";
export { render, userEvent };
