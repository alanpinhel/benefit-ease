import { Benefit } from "./benefit";

export type Account = {
  id: string;
  balance: number;
  benefits: Benefit;
};
