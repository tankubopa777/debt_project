import { DashboardRepository } from "../repositories/dashboard.repository";
import type {
    DebtSummaryStats,
    UpcomingPayment,
    DebtBreakdownItem,
    MonthlyChartItem,
} from "../repositories/dashboard.repository";
import type { DebtRow } from "../repositories/debt.repository";
import type { TransactionRow } from "../repositories/transaction.repository";

const THAI_MONTHS = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

const CHART_COLORS = [
    "#059669", "#0ea5e9", "#8b5cf6", "#f59e0b",
    "#ef4444", "#ec4899", "#14b8a6", "#6366f1",
    "#f97316", "#84cc16", "#06b6d4", "#a855f7",
];

export interface DashboardData {
    summary: DebtSummaryStats;
    upcomingPayments: UpcomingPayment[];
    recentTransactions: TransactionRow[];
    monthlyChart: MonthlyChartItem[];
    debtBreakdown: DebtBreakdownItem[];
}

export class DashboardService {
    constructor(private repo: DashboardRepository) { }

    async getDashboardData(userId: string): Promise<DashboardData> {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Fetch all data in parallel
        const [debts, recentTx, yearlyTx] = await Promise.all([
            this.repo.getAllDebts(userId),
            this.repo.getRecentTransactions(userId, 5),
            this.repo.getTransactionsByYear(userId, currentYear),
        ]);

        const summary = this.computeSummary(debts);
        const upcomingPayments = this.computeUpcomingPayments(debts, now);
        const monthlyChart = this.computeMonthlyChart(yearlyTx, currentYear);
        const debtBreakdown = this.computeDebtBreakdown(debts);

        return {
            summary,
            upcomingPayments,
            recentTransactions: recentTx,
            monthlyChart,
            debtBreakdown,
        };
    }

    private computeSummary(debts: DebtRow[]): DebtSummaryStats {
        let totalRemaining = 0;
        let totalOriginal = 0;
        let totalMinimumPayment = 0;
        let activeCount = 0;
        let paidOffCount = 0;
        let pausedCount = 0;

        for (const d of debts) {
            totalRemaining += d.remaining_amount;
            totalOriginal += d.total_amount;
            totalMinimumPayment += d.status === "active" ? d.minimum_payment : 0;

            if (d.status === "active") activeCount++;
            else if (d.status === "paid_off") paidOffCount++;
            else if (d.status === "paused") pausedCount++;
        }

        const totalPaid = totalOriginal - totalRemaining;
        const progressPercent =
            totalOriginal > 0
                ? Math.min(Math.round((totalPaid / totalOriginal) * 100), 100)
                : 0;

        return {
            totalRemaining,
            totalOriginal,
            totalPaid,
            totalMinimumPayment,
            activeCount,
            paidOffCount,
            pausedCount,
            progressPercent,
        };
    }

    private computeUpcomingPayments(
        debts: DebtRow[],
        now: Date
    ): UpcomingPayment[] {
        const today = now.getDate();
        const activeDebts = debts.filter(
            (d) => d.status === "active" && d.due_date_day !== null
        );

        const upcoming: UpcomingPayment[] = activeDebts.map((d) => {
            const dueDay = d.due_date_day!;
            let daysUntil = dueDay - today;

            // If due date already passed this month, it's for next month
            if (daysUntil < 0) {
                // Get days in current month
                const daysInMonth = new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0
                ).getDate();
                daysUntil = daysInMonth - today + dueDay;
            }

            return {
                id: d.id,
                name: d.name,
                lender: d.lender,
                minimumPayment: d.minimum_payment,
                remainingAmount: d.remaining_amount,
                dueDateDay: dueDay,
                daysUntilDue: daysUntil,
            };
        });

        // Sort by days until due (soonest first)
        return upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    }

    private computeMonthlyChart(
        transactions: TransactionRow[],
        year: number
    ): MonthlyChartItem[] {
        // Initialize all 12 months
        const monthMap = new Map<number, { income: number; expense: number }>();
        for (let m = 0; m < 12; m++) {
            monthMap.set(m, { income: 0, expense: 0 });
        }

        for (const tx of transactions) {
            const d = new Date(tx.transaction_date);
            const m = d.getMonth();
            const entry = monthMap.get(m)!;
            if (tx.type === "income") {
                entry.income += tx.amount;
            } else {
                entry.expense += tx.amount;
            }
        }

        const result: MonthlyChartItem[] = [];
        for (let m = 0; m < 12; m++) {
            const entry = monthMap.get(m)!;
            const mm = String(m + 1).padStart(2, "0");
            result.push({
                month: `${year}-${mm}`,
                monthLabel: THAI_MONTHS[m],
                income: Math.round(entry.income),
                expense: Math.round(entry.expense),
            });
        }

        return result;
    }

    private computeDebtBreakdown(debts: DebtRow[]): DebtBreakdownItem[] {
        const activeDebts = debts.filter(
            (d) => d.status === "active" && d.remaining_amount > 0
        );
        const totalRemaining = activeDebts.reduce(
            (sum, d) => sum + d.remaining_amount,
            0
        );

        return activeDebts.map((d, i) => ({
            name: d.name,
            remainingAmount: d.remaining_amount,
            totalAmount: d.total_amount,
            percentage:
                totalRemaining > 0
                    ? Math.round((d.remaining_amount / totalRemaining) * 100)
                    : 0,
            color: CHART_COLORS[i % CHART_COLORS.length],
        }));
    }
}
