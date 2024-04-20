import { accounts } from "@/mocks/handlers";
import {
  createAuthEnvironment,
  render,
  screen,
  userEvent,
  waitFor,
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

test("logs the person out when they click log out", async () => {
  render(<HomePage />);

  await userEvent.click(await screen.findByTestId("avatar-menu"));

  userEvent.click(await screen.findByText(/sair/i));

  await waitFor(() =>
    expect(screen.queryByText(/bom dia/i)).not.toBeInTheDocument()
  );
});
