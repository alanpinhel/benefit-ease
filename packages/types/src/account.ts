import { Benefit } from "./benefit";

export type Account = {
  id: number;
  balance: number;
  benefits: Benefit;
};
