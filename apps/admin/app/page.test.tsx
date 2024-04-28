import { benefits } from "@/mocks/handlers";
import { server } from "@/mocks/node";
import {
  createAuthEnvironment,
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  within,
} from "@/test-utils";
import { http } from "msw";
import HomePage from "./page";

createAuthEnvironment();

test("shows benefit accounts when accessing home", async () => {
  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando contas.../i)
  );

  const accountEl1 = screen.getByTestId("account-1");
  expect(within(accountEl1).getByText("🥦")).toBeInTheDocument();
  expect(within(accountEl1).getByText("R$ 840,00")).toBeInTheDocument();
  expect(within(accountEl1).getByText("Alimentação")).toBeInTheDocument();

  const accountEl2 = screen.getByTestId("account-2");
  expect(within(accountEl2).getByText("🚘")).toBeInTheDocument();
  expect(within(accountEl2).getByText("R$ 360,00")).toBeInTheDocument();
  expect(within(accountEl2).getByText("Mobilidade")).toBeInTheDocument();
});

test("shows add account button when there is still benefit available", async () => {
  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando contas.../i)
  );

  expect(screen.getByText(/adicionar conta/i)).toBeInTheDocument();
});

test("does not show the add account button when it no longer contains available benefits", async () => {
  server.use(
    http.get("*/rest/v1/benefits", () => Response.json(benefits.slice(0, 2)))
  );

  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando contas.../i)
  );

  expect(screen.queryByText(/adicionar conta/i)).not.toBeInTheDocument();
});

test("shows add account button disabled when fetch error occurs", async () => {
  server.use(
    http.get("*/rest/v1/benefits", () =>
      Response.json({ message: "Request rate limit exceeded" }, { status: 429 })
    )
  );

  render(<HomePage />);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando contas.../i)
  );

  const button = screen.getByRole("button", { name: /adicionar conta/i });
  expect(button).toBeDisabled();
  await userEvent.hover(button);
  expect(await screen.findByText(/adição indisponível/i)).toBeInTheDocument();
});

// This test should be executed because it will log out the user
test("logs the person out when they click log out", async () => {
  render(<HomePage />);

  await userEvent.click(screen.getByRole("button", { expanded: false }));
  userEvent.click(await screen.findByRole("menuitem", { name: /sair/i }));

  await waitForElementToBeRemoved(() => screen.getByText(/john doe/i));
});
