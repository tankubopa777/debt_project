"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { DebtSummaryStats } from "@/lib/repositories/dashboard.repository";

interface ProgressSectionProps {
  summary: DebtSummaryStats;
}

export function ProgressSection({ summary }: ProgressSectionProps) {
  const { totalRemaining, totalPaid, totalOriginal, progressPercent } = summary;

  const chartData = [
    { name: "ชำระแล้ว", value: totalPaid },
    { name: "คงเหลือ", value: totalRemaining },
  ];

  const COLORS = ["#059669", "#e2e8f0"];
  const DARK_COLORS = ["#34d399", "#1e293b"];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>ความคืบหน้าปลดหนี้</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-44 h-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1200}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      className="dark:hidden"
                    />
                  ))}
                </Pie>
                {/* Dark mode pie */}
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1200}
                  className="hidden dark:block"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-dark-${index}`}
                      fill={DARK_COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-2xl font-bold text-foreground"
              >
                {progressPercent}%
              </motion.span>
              <span className="text-xs text-muted-foreground">
                ปลดหนี้แล้ว
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">
                    ชำระแล้ว
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span className="text-sm text-muted-foreground">
                    คงเหลือ
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(totalRemaining)}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  หนี้รวมทั้งหมด
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(totalOriginal)}
                </span>
              </div>
            </div>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="rounded-xl bg-accent/50 p-3"
            >
              <p className="text-xs font-medium text-accent-foreground">
                {progressPercent === 0
                  ? "เริ่มต้นเส้นทางปลดหนี้กันเลย! ทุกก้าวมีค่า 🚀"
                  : progressPercent < 25
                    ? "เพิ่งเริ่มต้น แต่ทุกก้าวเล็กๆ สำคัญมาก! สู้ๆ 💪"
                    : progressPercent < 50
                      ? "มาได้ดีมาก! คุณกำลังอยู่บนเส้นทางที่ถูกต้อง 🎯"
                      : progressPercent < 75
                        ? "เกินครึ่งแล้ว! อิสรภาพทางการเงินใกล้เข้ามา 🌟"
                        : progressPercent < 100
                          ? "เหลืออีกนิดเดียว! คุณเก่งมาก 🏆"
                          : "ปลดหนี้ครบแล้ว! ยินดีด้วย! 🎉🎊"}
              </p>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
