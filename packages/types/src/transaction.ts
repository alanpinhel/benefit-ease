export type Transaction = {
  id: number;
  amount: number;
  name: string;
  created_at: string;
  accounts: {
    benefits: {
      icon: string;
    };
  };
};
