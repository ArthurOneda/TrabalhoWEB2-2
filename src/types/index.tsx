export type TransactionType = 'income' | 'expense';
export type ExpenseStatus = 'paid' | 'pending';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  value: number;
  date: Date;
  category: string;
  status?: ExpenseStatus;
}