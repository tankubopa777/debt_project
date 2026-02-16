import { SummaryCards } from "./_components/summary-cards";
import { DebtOverview } from "./_components/debt-overview";
import { QuickActions } from "./_components/quick-actions";
import { ProgressSection } from "./_components/progress-section";
import type { DashboardSummary, Debt } from "@/lib/types";

const MOCK_SUMMARY: DashboardSummary = {
  totalDebt: 485000,
  totalPaid: 215000,
  monthlyPayment: 12500,
  activeDebts: 4,
  progressPercent: 31,
};

const MOCK_DEBTS: Debt[] = [
  {
    id: "1",
    name: "สินเชื่อบ้าน",
    lender: "ธนาคารกสิกรไทย",
    totalAmount: 250000,
    remainingAmount: 180000,
    interestRate: 5.5,
    minimumPayment: 5000,
    dueDate: "2026-03-01",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "บัตรเครดิต",
    lender: "ธนาคารไทยพาณิชย์",
    totalAmount: 85000,
    remainingAmount: 42000,
    interestRate: 18.0,
    minimumPayment: 3500,
    dueDate: "2026-02-25",
    status: "active",
    createdAt: "2024-03-20",
  },
  {
    id: "3",
    name: "สินเชื่อรถ",
    lender: "ธนาคารกรุงเทพ",
    totalAmount: 120000,
    remainingAmount: 78000,
    interestRate: 3.5,
    minimumPayment: 3000,
    dueDate: "2026-03-05",
    status: "active",
    createdAt: "2023-08-10",
  },
  {
    id: "4",
    name: "กู้ยืมส่วนตัว",
    lender: "เพื่อน",
    totalAmount: 30000,
    remainingAmount: 30000,
    interestRate: 0,
    minimumPayment: 1000,
    dueDate: "2026-04-15",
    status: "active",
    createdAt: "2025-12-01",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          แดชบอร์ด
        </h1>
        <p className="mt-1 text-muted-foreground">
          ภาพรวมหนี้สินและความคืบหน้าของคุณ
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={MOCK_SUMMARY} />

      {/* Progress + Quick Actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressSection summary={MOCK_SUMMARY} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Debt Overview */}
      <div className="mt-8">
        <DebtOverview debts={MOCK_DEBTS} />
      </div>
    </div>
  );
}
