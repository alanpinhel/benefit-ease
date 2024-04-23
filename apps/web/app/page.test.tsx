import { server } from "@/mocks/node";
import {
  createAuthEnvironment,
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  within,
} from "@/test-utils";
import { advanceTo } from "jest-date-mock";
import { http } from "msw";
import HomePage from "./page";

createAuthEnvironment();

test("shows benefits when opening a homepage", async () => {
  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando benefícios.../i)
  );

  const accountEl1 = screen.getByTestId("account-1");
  expect(within(accountEl1).getByText("🚘")).toBeInTheDocument();
  expect(within(accountEl1).getByText("R$ 360,00")).toBeInTheDocument();
  expect(within(accountEl1).getByText("Mobilidade")).toBeInTheDocument();

  const accountEl2 = screen.getByTestId("account-2");
  expect(within(accountEl2).getByText("🥦")).toBeInTheDocument();
  expect(within(accountEl2).getByText("R$ 1.200,00")).toBeInTheDocument();
  expect(within(accountEl2).getByText("Alimentação")).toBeInTheDocument();
});

test("hides values when you click the hide action button", async () => {
  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando benefícios.../i)
  );

  userEvent.click(screen.getByRole("button", { name: /esconder valores/i }));
  await waitForElementToBeRemoved(() => screen.getByText("R$ 360,00"));
  expect(screen.queryAllByText(/🙈🙉🙊/)).toHaveLength(4);

  userEvent.click(screen.getByRole("button", { name: /mostrar valores/i }));
  await waitForElementToBeRemoved(() => screen.getAllByText(/🙈🙉🙊/));
  expect(screen.getByText("R$ 360,00")).toBeInTheDocument();
});

test("shows greeting according to the time of day", async () => {
  advanceTo(new Date(2024, 4, 21, 9, 0, 0));

  const { rerender } = render(<HomePage />);

  expect(screen.getByText(/bom dia/i)).toBeInTheDocument();

  advanceTo(new Date(2024, 4, 21, 15, 0, 0));
  rerender(<HomePage />);
  expect(await screen.findByText(/boa tarde/i)).toBeInTheDocument();

  advanceTo(new Date(2024, 4, 21, 22, 0, 0));
  rerender(<HomePage />);
  expect(screen.getByText(/boa noite/i)).toBeInTheDocument();
});

test("shows the benefits even when the access token expires", async () => {
  server.use(
    http.get(
      "*/rest/v1/accounts",
      () => Response.json({ message: "JWT expired" }, { status: 401 }),
      { once: true }
    )
  );

  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando benefícios.../i)
  );

  const accountEl1 = screen.getByTestId("account-1");
  expect(within(accountEl1).getByText("🚘")).toBeInTheDocument();
  expect(within(accountEl1).getByText("R$ 360,00")).toBeInTheDocument();
  expect(within(accountEl1).getByText("Mobilidade")).toBeInTheDocument();
});

test("shows transaction when opening a homepage", async () => {
  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando transações.../i)
  );

  const el1 = screen.getByTestId("transaction-1");
  expect(within(el1).getByText("Bora gastar!?")).toBeInTheDocument();
  expect(within(el1).getByText("21/05/2024 09:00")).toBeInTheDocument();
  expect(within(el1).getByText("R$ 1.200,00")).toBeInTheDocument();

  const el2 = screen.getByTestId("transaction-2");
  expect(within(el2).getByText("Supermercado")).toBeInTheDocument();
  expect(within(el2).getByText("22/05/2024 09:00")).toBeInTheDocument();
  expect(within(el2).getByText("R$ -29,21")).toBeInTheDocument();
});

// This test should be executed because it will log out the user
test("logs the person out when they click log out", async () => {
  render(<HomePage />);

  await userEvent.click(screen.getByRole("button", { expanded: false }));
  userEvent.click(await screen.findByRole("menuitem", { name: /sair/i }));

  await waitForElementToBeRemoved(() => screen.getByText(/john doe/i));
});
