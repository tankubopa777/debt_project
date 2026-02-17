"use client";

// ============================
// Summary Cards (Client Component)
// แสดงสถิติภาพรวมหนี้สิน 5 การ์ด พร้อม animated counter
// ============================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  TrendingDown,
  CalendarDays,
  CreditCard,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DebtSummaryStats } from "@/lib/repositories/dashboard.repository";

interface SummaryCardsProps {
  summary: DebtSummaryStats;
}

function AnimatedNumber({
  value,
  formatter,
}: {
  value: number;
  formatter: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplay(Math.round(current));
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>{formatter(display)}</>;
}

const STATS_CONFIG = [
  {
    key: "totalRemaining" as const,
    label: "หนี้คงเหลือทั้งหมด",
    icon: Banknote,
    iconBg: "bg-red-100 dark:bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    gradient: "from-red-500/5 to-transparent",
    format: (val: number) => formatCurrency(val),
  },
  {
    key: "totalPaid" as const,
    label: "ชำระไปแล้ว",
    icon: TrendingDown,
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/5 to-transparent",
    format: (val: number) => formatCurrency(val),
  },
  {
    key: "totalMinimumPayment" as const,
    label: "ผ่อนขั้นต่ำ/เดือน",
    icon: CalendarDays,
    iconBg: "bg-blue-100 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500/5 to-transparent",
    format: (val: number) => formatCurrency(val),
  },
  {
    key: "activeCount" as const,
    label: "หนี้ที่กำลังผ่อน",
    icon: CreditCard,
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500/5 to-transparent",
    format: (val: number) => `${val} รายการ`,
  },
  {
    key: "progressPercent" as const,
    label: "ความคืบหน้าปลดหนี้",
    icon: Target,
    iconBg: "bg-purple-100 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500/5 to-transparent",
    format: (val: number) => `${val}%`,
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {STATS_CONFIG.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <Card className="relative overflow-hidden h-full">
            {/* Subtle gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`}
            />
            <CardContent className="relative pt-5 pb-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
                    <AnimatedNumber
                      value={summary[stat.key]}
                      formatter={stat.format}
                    />
                  </p>
                </div>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <stat.icon
                    className={`h-4.5 w-4.5 ${stat.iconColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
