import { createAuthEnvironment, render, screen, within } from "@/test-utils";
import HomePage from "./page";

createAuthEnvironment();

test("shows benefit accounts when accessing home", async () => {
  render(<HomePage />);

  expect(await screen.findByText("Contas")).toBeInTheDocument();

  const accountEl1 = screen.getByTestId("account-1");
  expect(within(accountEl1).getByText("🥦")).toBeInTheDocument();
  expect(within(accountEl1).getByText("R$ 840,00")).toBeInTheDocument();
  expect(within(accountEl1).getByText("Alimentação")).toBeInTheDocument();

  const accountEl2 = screen.getByTestId("account-2");
  expect(within(accountEl2).getByText("🚘")).toBeInTheDocument();
  expect(within(accountEl2).getByText("R$ 360,00")).toBeInTheDocument();
  expect(within(accountEl2).getByText("Mobilidade")).toBeInTheDocument();
});
