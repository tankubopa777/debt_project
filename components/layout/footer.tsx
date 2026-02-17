// ============================
// Footer (Server Component)
// ============================

import Link from "next/link";
import {
  Wallet,
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Target,
  ClipboardCheck,
  Heart,
} from "lucide-react";

const MAIN_LINKS = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/debts", label: "หนี้สิน", icon: CreditCard },
  { href: "/transactions", label: "รายรับรายจ่าย", icon: ArrowLeftRight },
  { href: "/strategy", label: "กลยุทธ์", icon: Target },
  { href: "/quiz", label: "แบบทดสอบ", icon: ClipboardCheck },
];

const SUPPORT_LINKS = [
  { href: "#", label: "วิธีใช้งาน" },
  { href: "#", label: "คำถามที่พบบ่อย" },
  { href: "#", label: "ติดต่อเรา" },
  { href: "#", label: "นโยบายความเป็นส่วนตัว" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#080c16]">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white transition-transform duration-200 group-hover:scale-105">
                <Wallet className="h-[18px] w-[18px]" />
              </div>
              <span className="text-[15px] font-bold text-gray-900 dark:text-white">
                DebtFree
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              แอปช่วยวางแผนปลดหนี้ ติดตามยอดหนี้
              รายรับรายจ่าย และกลยุทธ์ปลดหนี้ที่เหมาะกับคุณ
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              เมนูหลัก
            </h3>
            <ul className="space-y-2.5">
              {MAIN_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              ช่วยเหลือ
            </h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              &copy; {currentYear} DebtFree. สงวนลิขสิทธิ์ทุกประการ
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              สร้างด้วย <Heart className="w-3 h-3 text-red-400 fill-red-400" />{" "}
              เพื่อคนไทย
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
