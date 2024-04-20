import { accounts } from "@/mocks/handlers";
import { createAuthEnvironment, render, screen } from "@/test-utils";
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
