import {
  PathParamsProviderMock,
  createAuthEnvironment,
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  within,
} from "@/test-utils";
import AccountPage from "./page";

createAuthEnvironment();

function renderAccountPage() {
  render(
    <PathParamsProviderMock params={{ id: "1" }}>
      <AccountPage />
    </PathParamsProviderMock>
  );
}

test("delete account when click delete button", async () => {
  renderAccountPage();

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando conta.../i)
  );

  await userEvent.click(screen.getByText(/excluir conta/i));
  await userEvent.click(await screen.findByText(/deletar conta/i));

  expect(await screen.findByText(/conta excluída/i)).toBeInTheDocument();
});

test("shows transactions for the selected account", async () => {
  renderAccountPage();

  await waitForElementToBeRemoved(() =>
    screen.getByText(/carregando conta.../i)
  );

  const el1 = await screen.findByTestId("transaction-1");
  expect(within(el1).getByText("Supermercado")).toBeInTheDocument();
  expect(within(el1).getByText("22/04/2024 09:00")).toBeInTheDocument();
  expect(within(el1).getByText("R$ -212,23")).toBeInTheDocument();
});
