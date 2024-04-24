import {
  createAuthEnvironment,
  fireEvent,
  render,
  screen,
  within,
} from "@/test-utils";
import { advanceTo } from "jest-date-mock";
import TransactionsPage from "./page";

createAuthEnvironment();

test("shows transaction when opening a transactions page", async () => {
  render(<TransactionsPage />);

  const el1 = await screen.findByTestId("transaction-1");
  expect(within(el1).getByText("Supermercado")).toBeInTheDocument();
  expect(within(el1).getByText("22/04/2024 09:00")).toBeInTheDocument();
  expect(within(el1).getByText("R$ -212,23")).toBeInTheDocument();

  const el2 = screen.getByTestId("transaction-2");
  expect(within(el2).getByText("Uber")).toBeInTheDocument();
  expect(within(el2).getByText("21/04/2024 09:00")).toBeInTheDocument();
  expect(within(el2).getByText("R$ -29,21")).toBeInTheDocument();

  const el3 = screen.getByTestId("transaction-3");
  expect(within(el3).getByText("Uber")).toBeInTheDocument();
  expect(within(el3).getByText("15/04/2024 09:00")).toBeInTheDocument();
  expect(within(el3).getByText("R$ -14,15")).toBeInTheDocument();

  const el4 = screen.getByTestId("transaction-4");
  expect(within(el4).getByText("Uber")).toBeInTheDocument();
  expect(within(el4).getByText("08/04/2024 09:00")).toBeInTheDocument();
  expect(within(el4).getByText("R$ -12,00")).toBeInTheDocument();
});

test("only shows transactions with 'uber' in the name", async () => {
  render(<TransactionsPage />);

  const el1 = await screen.findByTestId("transaction-1");

  fireEvent.change(screen.getByLabelText("Pesquisar"), {
    target: { value: "uber" },
  });

  expect(el1).not.toBeInTheDocument();
  expect(screen.getByTestId("transaction-2")).toBeInTheDocument();
  expect(screen.getByTestId("transaction-3")).toBeInTheDocument();
  expect(screen.getByTestId("transaction-4")).toBeInTheDocument();
});

test("only shows today's transactions", async () => {
  advanceTo(new Date("2024-04-22T09:00:00"));

  render(<TransactionsPage />);

  fireEvent.click(screen.getByText("Hoje"));

  expect(await screen.findByTestId("transaction-1")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-2")).not.toBeInTheDocument();
  expect(screen.queryByTestId("transaction-3")).not.toBeInTheDocument();
  expect(screen.queryByTestId("transaction-4")).not.toBeInTheDocument();
});

test("only shows transactions from yesterday", async () => {
  advanceTo(new Date("2024-04-22T09:00:00"));

  render(<TransactionsPage />);

  fireEvent.click(screen.getByText("Ontem"));

  expect(await screen.findByTestId("transaction-1")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-2")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-3")).not.toBeInTheDocument();
  expect(screen.queryByTestId("transaction-4")).not.toBeInTheDocument();
});

test("only shows transactions from 7 days ago", async () => {
  advanceTo(new Date("2024-04-22T09:00:00"));

  render(<TransactionsPage />);

  fireEvent.click(screen.getByText("7 dias"));

  expect(await screen.findByTestId("transaction-1")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-2")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-3")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-4")).not.toBeInTheDocument();
});

test("only shows transactions from 14 days ago", async () => {
  advanceTo(new Date("2024-04-22T09:00:00"));

  render(<TransactionsPage />);

  fireEvent.click(screen.getByText("14 dias"));

  expect(await screen.findByTestId("transaction-1")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-2")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-3")).toBeInTheDocument();
  expect(screen.queryByTestId("transaction-4")).toBeInTheDocument();
});
