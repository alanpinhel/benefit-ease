import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  RenderResult,
  render as testingLibraryRender,
} from "@testing-library/react";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { CookiesProvider } from "react-cookie";
import { cookies, defaultSetOptions } from "./lib/cookies";
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

type SearchParamsProviderMockProps = {
  searchParams?: URLSearchParams;
  children: React.ReactNode;
};

function SearchParamsProviderMock({
  searchParams,
  children,
}: SearchParamsProviderMockProps): React.ReactNode {
  const mockedSearchParams = searchParams || new URLSearchParams();
  return (
    <SearchParamsContext.Provider value={mockedSearchParams}>
      {children}
    </SearchParamsContext.Provider>
  );
}

export function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <AppRouterProviderMock>
        <SearchParamsProviderMock>
          <MantineProvider theme={theme}>
            <Notifications />
            <CookiesProvider defaultSetOptions={defaultSetOptions}>
              {children}
            </CookiesProvider>
          </MantineProvider>
        </SearchParamsProviderMock>
      </AppRouterProviderMock>
    ),
  });
}

export function createAuthEnvironment() {
  beforeAll(() => {
    cookies.set("access_token", "access_token");
    cookies.set("refresh_token", "refresh_token");
    cookies.set("user", { display_name: "John Doe" });
  });
  afterAll(() => {
    cookies.remove("access_token");
    cookies.remove("refresh_token");
    cookies.remove("user");
  });
}

export * from "@testing-library/react";
export * from "@testing-library/user-event";
