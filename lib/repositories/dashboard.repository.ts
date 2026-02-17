import { SupabaseClient } from "@supabase/supabase-js";
import type { DebtRow } from "./debt.repository";
import type { TransactionRow } from "./transaction.repository";

export interface DebtSummaryStats {
    totalRemaining: number;
    totalOriginal: number;
    totalPaid: number;
    totalMinimumPayment: number;
    activeCount: number;
    paidOffCount: number;
    pausedCount: number;
    progressPercent: number;
}

export interface UpcomingPayment {
    id: string;
    name: string;
    lender: string | null;
    minimumPayment: number;
    remainingAmount: number;
    dueDateDay: number;
    daysUntilDue: number;
}

export interface DebtBreakdownItem {
    name: string;
    remainingAmount: number;
    totalAmount: number;
    percentage: number;
    color: string;
}

export interface MonthlyChartItem {
    month: string;
    monthLabel: string;
    income: number;
    expense: number;
}

export class DashboardRepository {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Get all debts for a user
     */
    async getAllDebts(userId: string): Promise<DebtRow[]> {
        const { data, error } = await this.supabase
            .from("debts")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data ?? [];
    }

    /**
     * Get recent transactions (limit N)
     */
    async getRecentTransactions(
        userId: string,
        limit: number = 5
    ): Promise<TransactionRow[]> {
        const { data, error } = await this.supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .order("transaction_date", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data ?? [];
    }

    /**
     * Get all transactions for a given year (for monthly chart)
     */
    async getTransactionsByYear(
        userId: string,
        year: number
    ): Promise<TransactionRow[]> {
        const startDate = `${year}-01-01T00:00:00.000Z`;
        const endDate = `${year}-12-31T23:59:59.999Z`;

        const { data, error } = await this.supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .gte("transaction_date", startDate)
            .lte("transaction_date", endDate)
            .order("transaction_date", { ascending: true });

        if (error) throw error;
        return data ?? [];
    }
}
