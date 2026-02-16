// ============================
// Auth Callback Route Handler
// จัดการ OAuth callback, email confirmation
// และ sync ผู้ใช้ลงตาราง users
// ============================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRepository } from "@/lib/repositories/user.repository";
import { UserService } from "@/lib/services/user.service";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // หลัง login สำเร็จ → sync ข้อมูลผู้ใช้ลงตาราง users
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          const userRepository = new UserRepository(supabase);
          const userService = new UserService(userRepository);
          await userService.syncAuthUser(authUser);
        }
      } catch (syncError) {
        // ไม่ block login ถ้า sync ไม่สำเร็จ (log ไว้ debug)
        console.error("Failed to sync user to database:", syncError);
      }

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
