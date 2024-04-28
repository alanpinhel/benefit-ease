import {
  PathParamsProviderMock,
  createAuthEnvironment,
  render,
  screen,
  userEvent,
} from "@/test-utils";
import AccountPage from "./page";

createAuthEnvironment();

test("delete account when click delete button", async () => {
  render(
    <PathParamsProviderMock params={{ id: "1" }}>
      <AccountPage />
    </PathParamsProviderMock>
  );

  await userEvent.click(await screen.findByText("Excluir conta"));
  userEvent.click(await screen.findByText("Deletar conta"));

  expect(await screen.findByText(/conta excluída/i)).toBeInTheDocument();
});
