import type { Account, Benefit } from "@repo/types";
import { benefits } from "./benefits";

export const accounts: Account[] = [
  {
    id: "1",
    balance: 840,
    benefits: benefits[0] as Benefit,
  },
  {
    id: "2",
    balance: 360,
    benefits: benefits[1] as Benefit,
  },
];
