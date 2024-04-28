import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme } from "@repo/constants";
import {
  RenderResult,
  render as testingLibraryRender,
} from "@testing-library/react";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  PathParamsContext,
  SearchParamsContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { CookiesProvider } from "react-cookie";
import { SWRConfig } from "swr";
import { api } from "./lib/api";
import { cookies, defaultSetOptions } from "./lib/cookies";

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

type PathParamsProviderMockProps = {
  params?: Record<string, string>;
  children: React.ReactNode;
};

export function PathParamsProviderMock({
  params,
  children,
}: PathParamsProviderMockProps): React.ReactNode {
  const mockedParams = params || {};
  return (
    <PathParamsContext.Provider value={mockedParams}>
      {children}
    </PathParamsContext.Provider>
  );
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);
const provider = () => new Map();

export function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <AppRouterProviderMock>
        <PathParamsProviderMock>
          <SearchParamsProviderMock>
            <MantineProvider theme={theme}>
              <ModalsProvider>
                <Notifications />
                <CookiesProvider defaultSetOptions={defaultSetOptions}>
                  <SWRConfig value={{ fetcher, provider, dedupingInterval: 0 }}>
                    {children}
                  </SWRConfig>
                </CookiesProvider>
              </ModalsProvider>
            </MantineProvider>
          </SearchParamsProviderMock>
        </PathParamsProviderMock>
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
