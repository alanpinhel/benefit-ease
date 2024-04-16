import { server } from "@/mocks/node";
import { fireEvent, render, screen } from "@/test-utils";
import { http } from "msw";
import SignUpPage from "./page";

function renderSignUpPage() {
  render(<SignUpPage />);

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
      fireEvent.submit(screen.getByText(/criar conta/i));
    },
  };
}

test("shows error message when submitting with invalid filling", async () => {
  const { changeEmail, changePassword, submitForm } = renderSignUpPage();

  changeEmail("invalid-email");
  changePassword("123");
  submitForm();

  expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument();
  expect(screen.getByText(/mínimo de 6 caracteres/i)).toBeInTheDocument();
});

test("shows notification when server responds with error", async () => {
  server.use(
    http.post("*/auth/v1/signup", () =>
      Response.json({ message: "Email rate limit exceeded" }, { status: 429 })
    )
  );

  const { changeEmail, changePassword, submitForm } = renderSignUpPage();

  changeEmail("not-allowed@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/erro no servidor/i)).toBeInTheDocument();
});

test("shows notification when everything goes well", async () => {
  const { changeEmail, changePassword, submitForm } = renderSignUpPage();

  changeEmail("email@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/conta criada/i)).toBeInTheDocument();
});
