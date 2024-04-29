export type Transaction = {
  id: string;
  amount: number;
  name: string;
  created_at: string;
  accounts: {
    benefits: {
      icon: string;
    };
  };
};
