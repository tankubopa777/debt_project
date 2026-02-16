import { SupabaseClient } from "@supabase/supabase-js";

export interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface CreateUserData {
  id: string;
  email: string;
  display_name?: string | null;
}

export class UserRepository {
  constructor(private supabase: SupabaseClient) { }

  async findById(id: string): Promise<UserRow | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data;
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data;
  }

  async create(userData: CreateUserData): Promise<UserRow> {
    const { data, error } = await this.supabase
      .from("users")
      .insert({
        id: userData.id,
        email: userData.email,
        display_name: userData.display_name ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async upsert(userData: CreateUserData): Promise<UserRow> {
    const { data, error } = await this.supabase
      .from("users")
      .upsert(
        {
          id: userData.id,
          email: userData.email,
          display_name: userData.display_name ?? null,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
