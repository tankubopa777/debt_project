"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const errorParam = searchParams.get("error");

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === "auth-code-error"
      ? "เกิดข้อผิดพลาดในการยืนยันตัวตน กรุณาลองใหม่อีกครั้ง"
      : null
  );
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          } else if (error.message.includes("Email not confirmed")) {
            setError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
          } else {
            setError(error.message);
          }
          return;
        }

        // Redirect after successful login
        window.location.href = redirectTo;
      } else {
        // Register
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split("@")[0],
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setError("อีเมลนี้ถูกใช้งานแล้ว");
          } else if (
            error.message.includes("Password should be at least")
          ) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
          } else {
            setError(error.message);
          }
          return;
        }

        setSuccess(
          "สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ"
        );
        setEmail("");
        setPassword("");
        setDisplayName("");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        },
      });
      if (error) {
        // Supabase returns this when Google (or other provider) is not enabled in Dashboard
        const isProviderNotEnabled =
          error.message?.includes("provider is not enabled") ||
          error.message?.includes("Unsupported provider") ||
          (error as { code?: string })?.code === "validation_failed";
        if (isProviderNotEnabled) {
          setError(
            "ยังไม่ได้เปิดใช้การเข้าสู่ระบบด้วย Google ใน Supabase — ไปที่ Dashboard → Authentication → Providers → เปิดใช้ Google และใส่ Client ID กับ Client Secret จาก Google Cloud Console"
          );
        } else {
          setError(error.message || "ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่");
        }
        setLoading(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const isProviderNotEnabled =
        msg.includes("provider is not enabled") || msg.includes("Unsupported provider");
      setError(
        isProviderNotEnabled
          ? "ยังไม่ได้เปิดใช้การเข้าสู่ระบบด้วย Google ใน Supabase — ไปที่ Dashboard → Authentication → Providers → เปิดใช้ Google และใส่ Client ID กับ Client Secret จาก Google Cloud Console"
          : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      );
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-indigo-50 to-white dark:from-slate-950 dark:via-[#0a0e1a] dark:to-[#030712]" />

      {/* Decorative elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 dark:bg-indigo-400/5 blur-3xl animate-pulse" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="login-grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-blue-400"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-grid)" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold bg-linear-to-r from-gray-800 via-blue-600 to-gray-800 dark:from-white dark:via-cyan-300 dark:to-white bg-clip-text text-transparent">
                  DebtFree
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-md uppercase tracking-wider">
                  Beta
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-blue-500 dark:text-cyan-400" />
                ปลดหนี้อย่างมีแบบแผน
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-gray-200/70 dark:border-white/10 rounded-3xl shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 p-8 sm:p-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === "login"
                ? "เข้าสู่ระบบเพื่อจัดการหนี้สินของคุณ"
                : "สร้างบัญชีใหม่เพื่อเริ่มต้นปลดหนี้"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl px-4 py-3.5 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl px-4 py-3.5 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name (register only) */}
            {mode === "register" && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  ชื่อที่แสดง
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="ชื่อของคุณ"
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-300",
                      "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10",
                      "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-400/50",
                      "hover:border-gray-300 dark:hover:border-white/20"
                    )}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full pl-12 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-300",
                    "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-400/50",
                    "hover:border-gray-300 dark:hover:border-white/20"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className={cn(
                    "w-full pl-12 pr-12 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-300",
                    "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-400/50",
                    "hover:border-gray-300 dark:hover:border-white/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "group relative w-full overflow-hidden bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl text-sm transition-all duration-300",
                "hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700",
                "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === "login" ? "กำลังเข้าสู่ระบบ..." : "กำลังสมัคร..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
              {/* Shine effect */}
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              หรือ
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={cn(
              "group relative w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 border",
              "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10",
              "text-gray-700 dark:text-gray-200",
              "hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20",
              "hover:shadow-lg hover:shadow-gray-500/5 hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {mode === "login"
              ? "เข้าสู่ระบบด้วย Google"
              : "สมัครสมาชิกด้วย Google"}
          </button>

          {/* Toggle mode */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === "login" ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
              <button
                onClick={toggleMode}
                className="ml-2 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {mode === "login" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            ปลอดภัยด้วย Supabase Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
