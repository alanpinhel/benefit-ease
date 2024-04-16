import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  RenderResult,
  render as testingLibraryRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthProvider } from "./app/auth-context";
import { theme } from "./theme";

type AppRouterProviderMockProps = {
  router?: Partial<AppRouterInstance>;
  children: React.ReactNode;
};

function AppRouterProviderMock({
  router,
  children,
}: AppRouterProviderMockProps): React.ReactNode {
  const mockedRouter: AppRouterInstance = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    ...router,
  };
  return (
    <AppRouterContext.Provider value={mockedRouter}>
      {children}
    </AppRouterContext.Provider>
  );
}

function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <AppRouterProviderMock>
        <MantineProvider theme={theme}>
          <Notifications />
          <AuthProvider>{children}</AuthProvider>
        </MantineProvider>
      </AppRouterProviderMock>
    ),
  });
}

export * from "@testing-library/react";
export { render, userEvent };
