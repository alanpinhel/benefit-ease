import { accounts } from "@/mocks/handlers";
import { server } from "@/mocks/node";
import {
  createAuthEnvironment,
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@/test-utils";
import { advanceTo } from "jest-date-mock";
import { http } from "msw";
import HomePage, { Account } from "./page";

createAuthEnvironment();

test.each(accounts)(
  "shows benefit '$benefits.name' when opening a homepage",
  async (account) => {
    render(<HomePage />);

    expect(await screen.findByText(account.benefits.icon)).toBeInTheDocument();
    expect(screen.getByText(`R$ ${account.balance},00`)).toBeInTheDocument();
    expect(screen.getByText(account.benefits.name)).toBeInTheDocument();
  }
);

test("hides values when you click the hide action button", async () => {
  render(<HomePage />);

  const balance = `R$ ${accounts[0]?.balance},00`;

  expect(await screen.findByText(balance)).toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: /esconder valores/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(balance));
  expect(screen.queryAllByText(/🙈🙉🙊/)).toHaveLength(4);

  userEvent.click(screen.getByRole("button", { name: /mostrar valores/i }));
  await waitForElementToBeRemoved(() => screen.queryAllByText(/🙈🙉🙊/));
  expect(screen.getByText(balance)).toBeInTheDocument();
});

test("shows greeting according to the time of day", async () => {
  advanceTo(new Date(2024, 4, 21, 9, 0, 0));

  const { rerender } = render(<HomePage />);

  expect(await screen.findByText(/bom dia/i)).toBeInTheDocument();

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

  const account = accounts[0] as Account;

  expect(await screen.findByText(account.benefits.icon)).toBeInTheDocument();
  expect(screen.getByText(`R$ ${account.balance},00`)).toBeInTheDocument();
  expect(screen.getByText(account.benefits.name)).toBeInTheDocument();
});

// This test should be executed because it will log out the user
test("logs the person out when they click log out", async () => {
  render(<HomePage />);

  await userEvent.click(await screen.findByRole("button", { expanded: false }));

  userEvent.click(await screen.findByRole("menuitem", { name: /sair/i }));

  await waitFor(() =>
    expect(screen.queryByText(/bom dia/i)).not.toBeInTheDocument()
  );
});
