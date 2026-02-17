import { SupabaseClient } from "@supabase/supabase-js";

export interface TransactionRow {
    id: string;
    user_id: string;
    debt_id: string | null;
    type: "income" | "expense";
    category: string;
    amount: number;
    note: string | null;
    transaction_date: string;
    created_at: string;
}

export interface CreateTransactionData {
    user_id: string;
    debt_id?: string | null;
    type: "income" | "expense";
    category: string;
    amount: number;
    note?: string | null;
    transaction_date?: string;
}

export interface UpdateTransactionData {
    debt_id?: string | null;
    type?: "income" | "expense";
    category?: string;
    amount?: number;
    note?: string | null;
    transaction_date?: string;
}

export interface TransactionFilters {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
}

export interface MonthlySummaryRow {
    month: string;        // e.g. "2026-02"
    totalIncome: number;
    totalExpense: number;
    balance: number;
    count: number;
}

export interface DailySummaryRow {
    date: string;         // e.g. "2026-02-18"
    totalIncome: number;
    totalExpense: number;
    balance: number;
    count: number;
}

export class TransactionRepository {
    constructor(private supabase: SupabaseClient) { }

    async findAllByUserId(
        userId: string,
        filters?: TransactionFilters
    ): Promise<TransactionRow[]> {
        let query = this.supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .order("transaction_date", { ascending: false });

        if (filters?.type) {
            query = query.eq("type", filters.type);
        }
        if (filters?.category) {
            query = query.eq("category", filters.category);
        }
        if (filters?.startDate) {
            query = query.gte("transaction_date", filters.startDate);
        }
        if (filters?.endDate) {
            query = query.lte("transaction_date", filters.endDate);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data ?? [];
    }

    async findById(id: string): Promise<TransactionRow | null> {
        const { data, error } = await this.supabase
            .from("transactions")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }

        return data;
    }

    async create(txData: CreateTransactionData): Promise<TransactionRow> {
        const { data, error } = await this.supabase
            .from("transactions")
            .insert({
                user_id: txData.user_id,
                debt_id: txData.debt_id ?? null,
                type: txData.type,
                category: txData.category,
                amount: txData.amount,
                note: txData.note ?? null,
                transaction_date: txData.transaction_date ?? new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(
        id: string,
        updateData: UpdateTransactionData
    ): Promise<TransactionRow> {
        const { data, error } = await this.supabase
            .from("transactions")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from("transactions")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
}
