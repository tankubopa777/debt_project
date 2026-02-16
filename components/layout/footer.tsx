// ============================
// Footer (Server Component)
// ============================

import { Wallet } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              DebtFree
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} DebtFree. ปลดหนี้อย่างมีแบบแผน
          </p>
        </div>
      </div>
    </footer>
  );
}
