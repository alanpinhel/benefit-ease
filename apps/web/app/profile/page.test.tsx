import { server } from "@/mocks/node";
import { fireEvent, render, screen } from "@/test-utils";
import { http } from "msw";
import { removeAuthSession, saveAuthSession } from "../auth-context";
import { access_token, user } from "../auth-session-mock";
import ProfilePage from "./page";

// create authenticated environment
beforeAll(() => saveAuthSession(user, access_token));
afterAll(() => removeAuthSession());

function renderProfilePage() {
  render(<ProfilePage />);

  return {
    changeName(value: string) {
      fireEvent.input(screen.getByLabelText(/nome/i), {
        target: { value },
      });
    },
    changeEmail(value: string) {
      fireEvent.input(screen.getByLabelText(/e-mail/i), {
        target: { value },
      });
    },
    changePassword(value: string) {
      fireEvent.input(screen.getByLabelText(/senha/i), {
        target: { value },
      });
    },
    submitForm() {
      fireEvent.submit(screen.getByText(/salvar/i));
    },
    deleteAccount() {
      fireEvent.click(screen.getByText(/excluir conta/i));
    },
  };
}

test("shows error message when submitting with invalid filling", async () => {
  const { changeName, changeEmail, changePassword, submitForm } =
    renderProfilePage();

  changeName("f");
  changeEmail("invalid-email");
  changePassword("123");
  submitForm();

  expect(
    await screen.findByText(/mínimo de 2 caracteres/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
  expect(screen.getByText(/mínimo de 6 caracteres/i)).toBeInTheDocument();
});

test("shows notification when server responds with error", async () => {
  server.use(
    http.put("*/auth/v1/user", () =>
      Response.json({ message: "Email rate limit exceeded" }, { status: 429 })
    )
  );

  const { changeName, changeEmail, changePassword, submitForm } =
    renderProfilePage();

  changeName("Bob");
  changeEmail("not-allowed@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/erro no servidor/i)).toBeInTheDocument();
});

test("shows notification when everything goes well", async () => {
  const { changeName, changeEmail, submitForm } = renderProfilePage();

  changeName("Bob");
  changeEmail("email@email.com");
  submitForm();

  expect(await screen.findByText(/usuário atualizado/i)).toBeInTheDocument();
});
