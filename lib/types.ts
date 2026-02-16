// ============================
// Shared TypeScript Types
// ============================

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "food"
  | "transport"
  | "housing"
  | "utilities"
  | "entertainment"
  | "health"
  | "education"
  | "shopping"
  | "debt_payment"
  | "savings"
  | "salary"
  | "freelance"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  note?: string;
  date: string;
  createdAt: string;
}

export type DebtStatus = "active" | "paid_off" | "paused";

export interface Debt {
  id: string;
  name: string;
  lender: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  status: DebtStatus;
  createdAt: string;
}

export interface DashboardSummary {
  totalDebt: number;
  totalPaid: number;
  monthlyPayment: number;
  activeDebts: number;
  progressPercent: number;
}
