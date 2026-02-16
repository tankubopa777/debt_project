// ============================
// Transactions - Recent Transaction List (Server Component)
// รายการล่าสุด 5 รายการ
// ============================

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatThaiDateShort } from "@/lib/utils";
import {
  TRANSACTION_CATEGORY_ICONS,
  TRANSACTION_CATEGORY_LABELS,
} from "@/lib/constants";
import type { Transaction } from "@/lib/types";

interface RecentListProps {
  transactions: Transaction[];
}

export function RecentList({ transactions }: RecentListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายการล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            ยังไม่มีรายการ เริ่มบันทึกรายจ่ายแรกกันเลย!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors"
          >
            {/* Category Icon */}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
              {TRANSACTION_CATEGORY_ICONS[tx.category]}
            </span>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {TRANSACTION_CATEGORY_LABELS[tx.category]}
              </p>
              {tx.note && (
                <p className="text-xs text-muted-foreground truncate">{tx.note}</p>
              )}
            </div>

            {/* Amount & Date */}
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${tx.type === "income"
                    ? "text-sky-500 dark:text-sky-400"
                    : "text-foreground"
                  }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatThaiDateShort(tx.date)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
