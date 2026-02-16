// ============================
// Dashboard Summary Cards (Server Component)
// แสดงสถิติภาพรวมหนี้สิน
// ============================

import {
  Banknote,
  TrendingDown,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/types";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const STATS_CONFIG = [
  {
    key: "totalDebt" as const,
    label: "หนี้คงเหลือทั้งหมด",
    icon: Banknote,
    iconBg: "bg-red-100 dark:bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    format: (val: number) => formatCurrency(val),
  },
  {
    key: "totalPaid" as const,
    label: "ชำระแล้ว",
    icon: TrendingDown,
    iconBg: "bg-sky-100 dark:bg-sky-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
    format: (val: number) => formatCurrency(val),
  },
  {
    key: "monthlyPayment" as const,
    label: "ยอดผ่อนต่อเดือน",
    icon: CalendarDays,
    iconBg: "bg-blue-100 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    format: (val: number) => formatCurrency(val),
  },
  {
    key: "activeDebts" as const,
    label: "หนี้ที่กำลังผ่อน",
    icon: CreditCard,
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    format: (val: number) => `${val} รายการ`,
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS_CONFIG.map((stat) => (
        <Card key={stat.key} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {stat.format(summary[stat.key])}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
