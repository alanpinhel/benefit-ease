export type Account = {
  id: number;
  balance: number;
  benefits: {
    id: number;
    name: string;
    color_from: string;
    color_to: string;
    icon: string;
  };
};
