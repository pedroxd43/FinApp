export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // ISO string
  note?: string;
}

export type PeriodType = 'week' | 'month' | 'year';

export interface PeriodSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: { categoryId: string; categoryName: string; color: string; icon: string; total: number }[];
  byDay: { label: string; income: number; expense: number }[];
}
