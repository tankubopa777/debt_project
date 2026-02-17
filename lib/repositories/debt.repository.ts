import { SupabaseClient } from "@supabase/supabase-js";

export interface DebtRow {
  id: string;
  user_id: string;
  name: string;
  lender: string | null;
  total_amount: number;
  remaining_amount: number;
  interest_rate: number;
  minimum_payment: number;
  due_date_day: number | null;
  status: "active" | "paid_off" | "paused";
  created_at: string;
  updated_at: string;
}

export interface CreateDebtData {
  user_id: string;
  name: string;
  lender?: string | null;
  total_amount: number;
  remaining_amount?: number;
  interest_rate?: number;
  minimum_payment?: number;
  due_date_day?: number | null;
  status?: "active" | "paid_off" | "paused";
}

export interface UpdateDebtData {
  name?: string;
  lender?: string | null;
  total_amount?: number;
  remaining_amount?: number;
  interest_rate?: number;
  minimum_payment?: number;
  due_date_day?: number | null;
  status?: "active" | "paid_off" | "paused";
}

export class DebtRepository {
  constructor(private supabase: SupabaseClient) { }

  async findAllByUserId(
    userId: string,
    status?: string
  ): Promise<DebtRow[]> {
    let query = this.supabase
      .from("debts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data ?? [];
  }

  async findById(id: string): Promise<DebtRow | null> {
    const { data, error } = await this.supabase
      .from("debts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data;
  }

  async create(debtData: CreateDebtData): Promise<DebtRow> {
    const { data, error } = await this.supabase
      .from("debts")
      .insert({
        user_id: debtData.user_id,
        name: debtData.name,
        lender: debtData.lender ?? null,
        total_amount: debtData.total_amount,
        remaining_amount: debtData.remaining_amount ?? debtData.total_amount,
        interest_rate: debtData.interest_rate ?? 0,
        minimum_payment: debtData.minimum_payment ?? 0,
        due_date_day: debtData.due_date_day ?? null,
        status: debtData.status ?? "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateData: UpdateDebtData): Promise<DebtRow> {
    const { data, error } = await this.supabase
      .from("debts")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("debts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
