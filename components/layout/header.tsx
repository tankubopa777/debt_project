"use client";

// ============================
// Header / Navbar (Client Component)
// Premium header with scroll effects, gradient logo,
// animated nav items, auth state, and sleek mobile menu
// Theme: Green (#00A651 / #00C9A7 / #34D399)
// ============================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Wallet,
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Target,
  ClipboardCheck,
  Sparkles,
  Zap,
  Sun,
  Moon,
  ArrowRight,
  LogIn,
  LogOut,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

// Nav items with icons
const NAV_ITEMS = [
  { href: "/quiz", label: "แบบทดสอบ", icon: ClipboardCheck },
  { href: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/debts", label: "หนี้สิน", icon: CreditCard },
  { href: "/transactions", label: "รายรับรายจ่าย", icon: ArrowLeftRight },
  { href: "/strategy", label: "กลยุทธ์", icon: Target },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  const isHome = pathname === "/";
  const isLoginPage = pathname === "/login";

  // Track scroll for header glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get display name or email initial
  const userDisplayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "ผู้ใช้";
  const userInitial = (
    user?.user_metadata?.display_name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-white/95 dark:bg-[#0d1424]/95 backdrop-blur-2xl shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/10 border-b border-emerald-100/50 dark:border-white/10"
          : "bg-white/80 dark:bg-[#0d1424]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5"
      )}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-emerald-500/60 to-transparent dark:via-emerald-400/40 opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {/* Logo icon container */}
            <div className="relative">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-emerald-500/40">
                <Wallet className="h-5 w-5" />
              </div>
              {/* Glow ring on hover */}
              <div className="absolute -inset-1 rounded-xl bg-linear-to-br from-emerald-400 to-green-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
            </div>

            {/* Logo text */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold bg-linear-to-r from-gray-800 via-emerald-600 to-gray-800 dark:from-white dark:via-emerald-300 dark:to-white bg-clip-text text-transparent leading-tight tracking-tight transition-all duration-300">
                  DebtFree
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-linear-to-r from-emerald-500 to-green-500 text-white rounded-md uppercase tracking-wider shadow-sm">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                ปลดหนี้อย่างมีแบบแผน
              </p>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          {!isHome && !isLoginPage && (
            <nav className="hidden items-center gap-1.5 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="group/nav">
                    <div
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                        isActive
                          ? "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          isActive
                            ? "text-white"
                            : "text-gray-400 dark:text-gray-500 group-hover/nav:text-emerald-500 dark:group-hover/nav:text-emerald-400 group-hover/nav:scale-110"
                        )}
                      />
                      {item.label}
                      {/* Active sparkle indicator */}
                      {isActive && (
                        <Sparkles className="w-3 h-3 text-white/70" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3">
            {/* Auth Buttons */}
            {loading ? (
              <div className="flex items-center justify-center h-10 w-10">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            ) : user ? (
              /* ── Logged In: User Menu ── */
              <div className="flex items-center gap-2">
                {/* User avatar & name */}
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-green-500 text-white text-xs font-bold shadow-sm">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {userDisplayName}
                  </span>
                </div>

                {/* Sign out button */}
                <button
                  onClick={signOut}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95",
                    "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5",
                    "hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20",
                    "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  )}
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* ── Not Logged In: Login Button ── */
              <>
                {/* Home CTA Button */}
                {isHome && (
                  <Link href="/login" className="hidden sm:block">
                    <div className="group relative overflow-hidden bg-linear-to-r from-emerald-500 via-emerald-600 to-green-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/35 px-5 py-2 text-sm flex items-center gap-2">
                      <span className="relative z-10 flex items-center gap-2">
                        เข้าสู่ระบบ
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      {/* Shine sweep effect */}
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                  </Link>
                )}

                {/* Login icon (non-home, non-login pages) */}
                {!isHome && !isLoginPage && (
                  <Link
                    href="/login"
                    className={cn(
                      "flex h-10 items-center gap-2 px-4 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95",
                      "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10",
                      "hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/30",
                      "text-emerald-600 dark:text-emerald-400 text-sm font-semibold"
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                  </Link>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95",
                "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5",
                "hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20",
                "hover:shadow-md hover:shadow-emerald-500/5"
              )}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <Sun
                className={cn(
                  "h-4.5 w-4.5 transition-all duration-500 absolute",
                  theme === "dark"
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100 text-amber-500"
                )}
              />
              <Moon
                className={cn(
                  "h-4.5 w-4.5 transition-all duration-500 absolute",
                  theme === "light"
                    ? "-rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100 text-emerald-400"
                )}
              />
            </button>

            {/* Mobile Menu Button */}
            {!isHome && !isLoginPage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 md:hidden",
                  "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5",
                  "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300",
                  mobileMenuOpen && "bg-gray-100 dark:bg-white/10"
                )}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <X
                    className={cn(
                      "w-5 h-5 absolute inset-0 transition-all duration-300",
                      mobileMenuOpen
                        ? "rotate-0 scale-100 opacity-100"
                        : "rotate-90 scale-0 opacity-0"
                    )}
                  />
                  <Menu
                    className={cn(
                      "w-5 h-5 absolute inset-0 transition-all duration-300",
                      mobileMenuOpen
                        ? "-rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    )}
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-400 ease-in-out",
          !isHome && !isLoginPage && mobileMenuOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-gray-100 dark:border-white/10 bg-white/95 dark:bg-[#0d1424]/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-2 sm:px-6">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  />
                  {item.label}
                  {isActive && (
                    <Sparkles className="w-4 h-4 ml-auto text-white/70" />
                  )}
                </Link>
              );
            })}

            {/* Mobile User Info & Auth */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 mt-3">
              {user ? (
                <div className="space-y-2">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-green-500 text-white text-sm font-bold shadow-sm">
                      {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {userDisplayName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {/* Sign out */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-2xl h-12 font-semibold text-sm border border-red-100 dark:border-red-500/15 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 rounded-2xl h-12 font-bold text-sm transition-all duration-300">
                    <LogIn className="w-4 h-4" />
                    เข้าสู่ระบบ
                  </div>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
