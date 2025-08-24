export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
};
