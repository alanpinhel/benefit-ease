import { accounts } from "@/mocks/handlers";
import {
  createAuthEnvironment,
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@/test-utils";
import HomePage from "./page";

createAuthEnvironment();

test.each(accounts)(
  "shows benefit '$benefit.name' when opening a homepage",
  async (account) => {
    render(<HomePage />);

    expect(await screen.findByText(account.benefit.icon)).toBeInTheDocument();
    expect(screen.getByText(`R$ ${account.balance},00`)).toBeInTheDocument();
    expect(screen.getByText(account.benefit.name)).toBeInTheDocument();
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

// This test should be executed because it will log out the user
test("logs the person out when they click log out", async () => {
  render(<HomePage />);

  await userEvent.click(await screen.findByRole("button", { expanded: false }));

  userEvent.click(await screen.findByRole("menuitem", { name: /sair/i }));

  await waitFor(() =>
    expect(screen.queryByText(/bom dia/i)).not.toBeInTheDocument()
  );
});
