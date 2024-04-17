import { server } from "@/mocks/node";
import { fireEvent, render, screen } from "@/test-utils";
import { http } from "msw";
import SignUpPage from "./page";

function renderSignUpPage() {
  render(<SignUpPage />);

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
      fireEvent.submit(screen.getByText(/criar conta/i));
    },
  };
}

test("shows error message when submitting with invalid filling", async () => {
  const { changeName, changeEmail, changePassword, submitForm } =
    renderSignUpPage();

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
    http.post("*/auth/v1/signup", () =>
      Response.json({ message: "Email rate limit exceeded" }, { status: 429 })
    )
  );

  const { changeName, changeEmail, changePassword, submitForm } =
    renderSignUpPage();

  changeName("Bob");
  changeEmail("not-allowed@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/erro no servidor/i)).toBeInTheDocument();
});

test("shows notification when everything goes well", async () => {
  const { changeName, changeEmail, changePassword, submitForm } =
    renderSignUpPage();

  changeName("Bob");
  changeEmail("email@email.com");
  changePassword("password123");
  submitForm();

  expect(await screen.findByText(/conta criada/i)).toBeInTheDocument();
});
