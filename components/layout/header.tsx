"use client";
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
  Sun,
  Moon,
  ArrowRight,
  LogIn,
  LogOut,
  Loader2,
  ChevronDown,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  const isHome = pathname === "/";
  const isLoginPage = pathname === "/login";

  // Track scroll for header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [userMenuOpen]);

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
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-[#0d1424]/90 backdrop-blur-xl shadow-sm border-b border-gray-200/80 dark:border-white/10"
          : "bg-white dark:bg-[#0d1424] border-b border-gray-100 dark:border-white/5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white transition-transform duration-200 group-hover:scale-105">
              <Wallet className="h-[18px] w-[18px]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                DebtFree
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-tight">
                ปลดหนี้อย่างมีแบบแผน
              </p>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          {!isHome && !isLoginPage && (
            <nav className="hidden items-center gap-0.5 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                        isActive
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-400 dark:text-gray-500"
                        )}
                      />
                      {item.label}
                      {/* Active bottom indicator */}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Auth Section */}
            {loading ? (
              <div className="flex items-center justify-center h-9 w-9">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            ) : user ? (
              /* ── Logged In: User Menu ── */
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors duration-200",
                    "hover:bg-gray-50 dark:hover:bg-white/5",
                    userMenuOpen && "bg-gray-50 dark:bg-white/5"
                  )}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-semibold">
                    {userInitial}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                    {userDisplayName}
                  </span>
                  <ChevronDown
                    className={cn(
                      "hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-white dark:bg-[#141c2e] border border-gray-200 dark:border-white/10 shadow-lg shadow-black/8 dark:shadow-black/30 py-1.5 z-50">
                    {/* User info */}
                    <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-white/5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {userDisplayName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    {/* Sign out */}
                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Not Logged In: Login Button ── */
              <>
                {isHome && (
                  <Link href="/login" className="hidden sm:block">
                    <div className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-200">
                      เข้าสู่ระบบ
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                )}

                {!isHome && !isLoginPage && (
                  <Link
                    href="/login"
                    className="flex h-9 items-center gap-2 px-3.5 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/15 transition-colors duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                  </Link>
                )}
              </>
            )}

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <Sun
                className={cn(
                  "h-[18px] w-[18px] transition-all duration-300 absolute",
                  theme === "dark"
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                )}
              />
              <Moon
                className={cn(
                  "h-[18px] w-[18px] transition-all duration-300 absolute",
                  theme === "light"
                    ? "-rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                )}
              />
            </button>

            {/* Mobile Menu Button */}
            {!isHome && !isLoginPage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          !isHome && !isLoginPage && mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0d1424]">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-1 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px]",
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5 mt-2">
              {user ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-semibold">
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
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <LogOut className="w-[18px] h-[18px]" />
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg h-10 font-semibold text-sm transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
