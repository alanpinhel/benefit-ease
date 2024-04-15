import LoginPage from "@/app/login/page";
import { server } from "@/mocks/node";
import { fireEvent, render, screen } from "@/test-utils";
import { http } from "msw";

function renderLoginPage() {
  render(<LoginPage />);

  return {
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
      fireEvent.submit(screen.getByText(/entrar/i));
    },
  };
}

test("shows error message when submitting with invalid filling", async () => {
  const { changeEmail, changePassword, submitForm } = renderLoginPage();

  changeEmail("invalid-email");
  changePassword("123");
  submitForm();

  expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument();
  expect(screen.getByText(/mínimo de 6 caracteres/i)).toBeInTheDocument();
});

test("shows notification when server responds with error", async () => {
  server.use(
    http.post("*/auth/v1/token", () =>
      Response.json({ message: "Email rate limit exceeded" }, { status: 429 })
    )
  );

  const { changeEmail, changePassword, submitForm } = renderLoginPage();

  changeEmail("not-allowed@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/erro no servidor/i)).toBeInTheDocument();
});

test("shows notification when server responds with invalid credentials", async () => {
  server.use(
    http.post("*/auth/v1/token", () =>
      Response.json(
        { error_description: "Invalid login credentials" },
        { status: 400 }
      )
    )
  );

  const { changeEmail, changePassword, submitForm } = renderLoginPage();

  changeEmail("email@email.com");
  changePassword("invalid123");
  submitForm();

  expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
});

test("shows notification when everything goes well", async () => {
  const { changeEmail, changePassword, submitForm } = renderLoginPage();

  changeEmail("email@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/boas-vindas/i)).toBeInTheDocument();
});
